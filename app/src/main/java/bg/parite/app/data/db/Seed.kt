package bg.parite.app.data.db

import android.content.Context
import bg.parite.app.data.model.Account
import bg.parite.app.data.model.Category
import bg.parite.app.data.model.CategoryKind
import java.util.Currency
import java.util.Locale

object Seed {

    private data class CatSeed(val key: String, val emoji: String, val colorHex: String)

    suspend fun populate(db: PariteDatabase, context: Context) {
        if (db.accountDao().count() == 0) {
            db.accountDao().insertAll(defaultAccounts(context))
        }
        if (db.categoryDao().count() == 0) {
            db.categoryDao().insertAll(defaultCategories(context))
        }
    }

    private fun defaultCurrency(): String =
        runCatching { Currency.getInstance(Locale.getDefault()).currencyCode }
            .getOrDefault("EUR")

    private fun defaultAccounts(context: Context): List<Account> {
        val cur = defaultCurrency()
        return listOf(
            Account(name = context.getString(stringId("acc_cash")), nameKey = "acc_cash",
                currency = cur, emoji = "💵", colorHex = "#7BA98C", sortOrder = 0),
            Account(name = context.getString(stringId("acc_card")), nameKey = "acc_card",
                currency = cur, emoji = "💳", colorHex = "#5B8DBE", sortOrder = 1),
            Account(name = context.getString(stringId("acc_savings")), nameKey = "acc_savings",
                currency = cur, emoji = "🏦", colorHex = "#C58B5C", sortOrder = 2),
        )
    }

    private fun defaultCategories(context: Context): List<Category> {
        val expense = listOf(
            CatSeed("cat_food",          "🍕", "#E07A5F"),
            CatSeed("cat_groceries",     "🛒", "#7BA98C"),
            CatSeed("cat_transport",     "🚗", "#5B8DBE"),
            CatSeed("cat_housing",       "🏠", "#9B7BB8"),
            CatSeed("cat_bills",         "⚡", "#D4A24C"),
            CatSeed("cat_entertainment", "🎉", "#D8758F"),
            CatSeed("cat_clothing",      "👕", "#6BA9A9"),
            CatSeed("cat_health",        "💊", "#B85C5C"),
            CatSeed("cat_education",     "📚", "#8B7BB8"),
            CatSeed("cat_gifts",         "🎁", "#C58B5C"),
            CatSeed("cat_travel",        "✈️", "#5C8BC5"),
            CatSeed("cat_other",         "📦", "#8E8E8E"),
        )
        val income = listOf(
            CatSeed("cat_salary",   "💰", "#7BA98C"),
            CatSeed("cat_gift_in",  "🎁", "#C58B5C"),
            CatSeed("cat_other_in", "✨", "#8E8E8E"),
        )

        val rows = mutableListOf<Category>()
        expense.forEachIndexed { i, c ->
            rows += Category(
                name = context.getString(stringId(c.key)),
                nameKey = c.key,
                kind = CategoryKind.EXPENSE,
                emoji = c.emoji,
                colorHex = c.colorHex,
                sortOrder = i,
            )
        }
        income.forEachIndexed { i, c ->
            rows += Category(
                name = context.getString(stringId(c.key)),
                nameKey = c.key,
                kind = CategoryKind.INCOME,
                emoji = c.emoji,
                colorHex = c.colorHex,
                sortOrder = i,
            )
        }
        return rows
    }

    private fun stringId(name: String): Int =
        bg.parite.app.R.string::class.java.getField(name).getInt(null)
}
