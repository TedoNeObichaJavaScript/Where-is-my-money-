package bg.parite.app.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class RecurrenceFreq { DAILY, WEEKLY, MONTHLY, YEARLY }

@Entity(tableName = "recurring_rules")
data class RecurringRule(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val accountId: Long,
    val categoryId: Long,
    val type: TxnType,
    val amountMinor: Long,
    val currency: String,
    val freq: RecurrenceFreq,
    val intervalCount: Int = 1,
    val startAt: Long,
    val endAt: Long? = null,
    val nextDueAt: Long,
    val note: String? = null,
    val active: Boolean = true,
)
