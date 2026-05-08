package bg.parite.app.data.backup

import android.content.Context
import android.net.Uri
import androidx.room.withTransaction
import bg.parite.app.data.db.PariteDatabase
import bg.parite.app.data.model.Account
import bg.parite.app.data.model.Category
import bg.parite.app.data.model.CategoryKind
import bg.parite.app.data.model.RecurrenceFreq
import bg.parite.app.data.model.RecurringRule
import bg.parite.app.data.model.Transaction
import bg.parite.app.data.model.TxnType
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject

data class BackupResult(val accounts: Int, val categories: Int, val transactions: Int, val rules: Int)

private const val VERSION = 1

class BackupService(private val db: PariteDatabase) {

    suspend fun export(context: Context, uri: Uri): Result<BackupResult> = runCatching {
        withContext(Dispatchers.IO) {
            val accounts = db.accountDao().observeAll().first()
            val categories = db.categoryDao().observeAll().first()
            val transactions = db.transactionDao().observeAll().first()
            val rules = db.recurringRuleDao().observeActive().first()

            val root = JSONObject()
                .put("version", VERSION)
                .put("exportedAt", System.currentTimeMillis())
                .put("accounts", accounts.toJsonArray { accountToJson(it) })
                .put("categories", categories.toJsonArray { categoryToJson(it) })
                .put("transactions", transactions.toJsonArray { transactionToJson(it) })
                .put("recurringRules", rules.toJsonArray { recurringRuleToJson(it) })

            context.contentResolver.openOutputStream(uri, "wt")
                ?.use { it.write(root.toString(2).toByteArray(Charsets.UTF_8)) }
                ?: error("Cannot open output stream for $uri")

            BackupResult(accounts.size, categories.size, transactions.size, rules.size)
        }
    }

    suspend fun importReplace(context: Context, uri: Uri): Result<BackupResult> = runCatching {
        withContext(Dispatchers.IO) {
            val text = context.contentResolver.openInputStream(uri)
                ?.use { it.readBytes().toString(Charsets.UTF_8) }
                ?: error("Cannot open input stream for $uri")
            val root = JSONObject(text)
            val version = root.optInt("version", 0)
            require(version in 1..VERSION) { "Unsupported backup version $version" }

            val accounts = root.optJSONArray("accounts").parseList(::accountFromJson)
            val categories = root.optJSONArray("categories").parseList(::categoryFromJson)
            val transactions = root.optJSONArray("transactions").parseList(::transactionFromJson)
            val rules = root.optJSONArray("recurringRules").parseList(::recurringRuleFromJson)

            db.withTransaction {
                db.transactionDao().wipe()
                db.recurringRuleDao().wipe()
                db.categoryDao().wipe()
                db.accountDao().wipe()

                if (accounts.isNotEmpty()) db.accountDao().insertAll(accounts)
                if (categories.isNotEmpty()) db.categoryDao().insertAll(categories)
                transactions.forEach { db.transactionDao().insert(it) }
                rules.forEach { db.recurringRuleDao().insert(it) }
            }

            BackupResult(accounts.size, categories.size, transactions.size, rules.size)
        }
    }
}

private fun <T> List<T>.toJsonArray(map: (T) -> JSONObject): JSONArray =
    JSONArray().also { arr -> forEach { arr.put(map(it)) } }

private inline fun <T> JSONArray?.parseList(map: (JSONObject) -> T): List<T> {
    if (this == null) return emptyList()
    val out = ArrayList<T>(length())
    for (i in 0 until length()) out += map(getJSONObject(i))
    return out
}

private fun JSONObject.optStringOrNull(key: String): String? =
    if (!has(key) || isNull(key)) null else getString(key).ifEmpty { null }

private fun JSONObject.optLongOrNull(key: String): Long? =
    if (!has(key) || isNull(key)) null else getLong(key)

private fun accountToJson(a: Account) = JSONObject()
    .put("id", a.id).put("name", a.name).put("nameKey", a.nameKey)
    .put("currency", a.currency).put("openingMinor", a.openingMinor)
    .put("colorHex", a.colorHex).put("emoji", a.emoji)
    .put("sortOrder", a.sortOrder).put("archived", a.archived)

private fun categoryToJson(c: Category) = JSONObject()
    .put("id", c.id).put("name", c.name).put("nameKey", c.nameKey)
    .put("kind", c.kind.name).put("emoji", c.emoji).put("colorHex", c.colorHex)
    .put("sortOrder", c.sortOrder).put("hidden", c.hidden)

private fun transactionToJson(t: Transaction) = JSONObject()
    .put("id", t.id).put("accountId", t.accountId).put("categoryId", t.categoryId)
    .put("type", t.type.name).put("amountMinor", t.amountMinor).put("currency", t.currency)
    .put("occurredAt", t.occurredAt).put("note", t.note)
    .put("recurringRuleId", t.recurringRuleId).put("createdAt", t.createdAt)

private fun recurringRuleToJson(r: RecurringRule) = JSONObject()
    .put("id", r.id).put("accountId", r.accountId).put("categoryId", r.categoryId)
    .put("type", r.type.name).put("amountMinor", r.amountMinor).put("currency", r.currency)
    .put("freq", r.freq.name).put("intervalCount", r.intervalCount)
    .put("startAt", r.startAt).put("endAt", r.endAt).put("nextDueAt", r.nextDueAt)
    .put("note", r.note).put("active", r.active)

private fun accountFromJson(o: JSONObject) = Account(
    id = o.getLong("id"),
    name = o.getString("name"),
    nameKey = o.optStringOrNull("nameKey"),
    currency = o.getString("currency"),
    openingMinor = o.optLong("openingMinor", 0),
    colorHex = o.getString("colorHex"),
    emoji = o.getString("emoji"),
    sortOrder = o.optInt("sortOrder", 0),
    archived = o.optBoolean("archived", false),
)

private fun categoryFromJson(o: JSONObject) = Category(
    id = o.getLong("id"),
    name = o.getString("name"),
    nameKey = o.optStringOrNull("nameKey"),
    kind = CategoryKind.valueOf(o.getString("kind")),
    emoji = o.getString("emoji"),
    colorHex = o.getString("colorHex"),
    sortOrder = o.optInt("sortOrder", 0),
    hidden = o.optBoolean("hidden", false),
)

private fun transactionFromJson(o: JSONObject) = Transaction(
    id = o.getLong("id"),
    accountId = o.getLong("accountId"),
    categoryId = o.getLong("categoryId"),
    type = TxnType.valueOf(o.getString("type")),
    amountMinor = o.getLong("amountMinor"),
    currency = o.getString("currency"),
    occurredAt = o.getLong("occurredAt"),
    note = o.optStringOrNull("note"),
    recurringRuleId = o.optLongOrNull("recurringRuleId"),
    createdAt = o.optLong("createdAt", System.currentTimeMillis()),
)

private fun recurringRuleFromJson(o: JSONObject) = RecurringRule(
    id = o.getLong("id"),
    accountId = o.getLong("accountId"),
    categoryId = o.getLong("categoryId"),
    type = TxnType.valueOf(o.getString("type")),
    amountMinor = o.getLong("amountMinor"),
    currency = o.getString("currency"),
    freq = RecurrenceFreq.valueOf(o.getString("freq")),
    intervalCount = o.optInt("intervalCount", 1),
    startAt = o.getLong("startAt"),
    endAt = o.optLongOrNull("endAt"),
    nextDueAt = o.getLong("nextDueAt"),
    note = o.optStringOrNull("note"),
    active = o.optBoolean("active", true),
)
