package bg.parite.app.ui.screens.analytics

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import bg.parite.app.data.db.CategoryTotal
import bg.parite.app.data.model.Category
import bg.parite.app.data.model.Transaction
import bg.parite.app.data.model.TxnType
import bg.parite.app.data.repo.CategoryRepository
import bg.parite.app.data.repo.TransactionRepository
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.stateIn
import java.util.Calendar

data class AnalyticsUiState(
    val monthLabel: String = "",
    val monthStart: Long = 0,
    val monthEnd: Long = 0,
    val daysInMonth: Int = 30,
    val displayCurrency: String = "EUR",
    val expenseTotalMinor: Long = 0,
    val incomeTotalMinor: Long = 0,
    val categoryTotals: List<CategoryTotal> = emptyList(),
    val categories: Map<Long, Category> = emptyMap(),
    val dailyExpensesMinor: List<Long> = emptyList(),
    val isCurrentMonth: Boolean = true,
    val isFutureMonth: Boolean = false,
)

@OptIn(ExperimentalCoroutinesApi::class)
class AnalyticsViewModel(
    private val txnRepo: TransactionRepository,
    private val categoryRepo: CategoryRepository,
    private val displayCurrency: () -> String,
) : ViewModel() {

    private val cursor = MutableStateFlow(monthCursorNow())

    val state: StateFlow<AnalyticsUiState> = cursor.flatMapLatest { c ->
        val (start, end, label, days) = c
        combine(
            txnRepo.observeTotalBetween(TxnType.EXPENSE, start, end),
            txnRepo.observeTotalBetween(TxnType.INCOME, start, end),
            txnRepo.observeCategoryTotals(TxnType.EXPENSE, start, end),
            txnRepo.observeBetween(start, end),
            categoryRepo.observeAll(),
        ) { exp, inc, catTotals, txns, cats ->
            val nowCal = Calendar.getInstance()
            val mc = MonthCursor(start, end, label, days)
            AnalyticsUiState(
                monthLabel = label,
                monthStart = start,
                monthEnd = end,
                daysInMonth = days,
                displayCurrency = displayCurrency(),
                expenseTotalMinor = exp,
                incomeTotalMinor = inc,
                categoryTotals = catTotals,
                categories = cats.associateBy { it.id },
                dailyExpensesMinor = aggregateDailyExpenses(txns, mc),
                isCurrentMonth = isSameMonth(nowCal, start),
                isFutureMonth = start > nowCal.timeInMillis,
            )
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), AnalyticsUiState())

    fun nextMonth() {
        val (s, _, _, _) = cursor.value
        val cal = Calendar.getInstance().apply {
            timeInMillis = s
            add(Calendar.MONTH, 1)
        }
        cursor.value = monthCursor(cal)
    }

    fun previousMonth() {
        val (s, _, _, _) = cursor.value
        val cal = Calendar.getInstance().apply {
            timeInMillis = s
            add(Calendar.MONTH, -1)
        }
        cursor.value = monthCursor(cal)
    }

    private data class MonthCursor(val start: Long, val end: Long, val label: String, val daysInMonth: Int)

    private fun monthCursorNow(): MonthCursor = monthCursor(Calendar.getInstance())

    private fun monthCursor(cal: Calendar): MonthCursor {
        val c = (cal.clone() as Calendar)
        c.set(Calendar.DAY_OF_MONTH, 1)
        c.set(Calendar.HOUR_OF_DAY, 0); c.set(Calendar.MINUTE, 0)
        c.set(Calendar.SECOND, 0); c.set(Calendar.MILLISECOND, 0)
        val start = c.timeInMillis
        val days = c.getActualMaximum(Calendar.DAY_OF_MONTH)
        c.add(Calendar.MONTH, 1)
        val end = c.timeInMillis - 1
        val label = java.text.SimpleDateFormat("LLLL yyyy", java.util.Locale.getDefault())
            .format(java.util.Date(start))
            .replaceFirstChar { it.titlecase(java.util.Locale.getDefault()) }
        return MonthCursor(start, end, label, days)
    }

    private fun aggregateDailyExpenses(
        txns: List<Transaction>,
        cursor: MonthCursor,
    ): List<Long> {
        val buckets = LongArray(cursor.daysInMonth)
        val cal = Calendar.getInstance()
        txns.forEach { t ->
            if (t.type != TxnType.EXPENSE) return@forEach
            cal.timeInMillis = t.occurredAt
            val day = cal.get(Calendar.DAY_OF_MONTH)
            if (day in 1..cursor.daysInMonth) buckets[day - 1] += t.amountMinor
        }
        return buckets.toList()
    }

    private fun isSameMonth(now: Calendar, monthStart: Long): Boolean {
        val s = Calendar.getInstance().apply { timeInMillis = monthStart }
        return now.get(Calendar.YEAR) == s.get(Calendar.YEAR) &&
            now.get(Calendar.MONTH) == s.get(Calendar.MONTH)
    }
}
