package bg.parite.app.ui.screens.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import bg.parite.app.data.db.AccountBalance
import bg.parite.app.data.model.Account
import bg.parite.app.data.model.Category
import bg.parite.app.data.model.Transaction
import bg.parite.app.data.repo.AccountRepository
import bg.parite.app.data.repo.CategoryRepository
import bg.parite.app.data.repo.TransactionRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import java.util.Calendar

data class HomeUiState(
    val accounts: List<Account> = emptyList(),
    val categories: List<Category> = emptyList(),
    val recent: List<Transaction> = emptyList(),
    val balances: List<AccountBalance> = emptyList(),
    val todaySpentMinor: Long = 0,
    val monthSpentMinor: Long = 0,
    val displayCurrency: String = "EUR",
)

class HomeViewModel(
    txnRepo: TransactionRepository,
    accountRepo: AccountRepository,
    categoryRepo: CategoryRepository,
) : ViewModel() {

    private val today = dayBounds()
    private val month = monthBounds()

    val state: StateFlow<HomeUiState> = combine(
        accountRepo.observeActive(),
        categoryRepo.observeAll(),
        txnRepo.observeRecent(20),
        txnRepo.observeBalances(),
        combine(
            txnRepo.observeExpenseTotalBetween(today.first, today.second),
            txnRepo.observeExpenseTotalBetween(month.first, month.second),
        ) { t, m -> t to m },
    ) { accounts, categories, recent, balances, totals ->
        HomeUiState(
            accounts = accounts,
            categories = categories,
            recent = recent,
            balances = balances,
            todaySpentMinor = totals.first,
            monthSpentMinor = totals.second,
            displayCurrency = accounts.firstOrNull()?.currency ?: "EUR",
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), HomeUiState())

    private fun dayBounds(): Pair<Long, Long> {
        val cal = Calendar.getInstance()
        cal.set(Calendar.HOUR_OF_DAY, 0); cal.set(Calendar.MINUTE, 0)
        cal.set(Calendar.SECOND, 0); cal.set(Calendar.MILLISECOND, 0)
        val start = cal.timeInMillis
        cal.add(Calendar.DAY_OF_MONTH, 1)
        return start to cal.timeInMillis - 1
    }

    private fun monthBounds(): Pair<Long, Long> {
        val cal = Calendar.getInstance()
        cal.set(Calendar.DAY_OF_MONTH, 1)
        cal.set(Calendar.HOUR_OF_DAY, 0); cal.set(Calendar.MINUTE, 0)
        cal.set(Calendar.SECOND, 0); cal.set(Calendar.MILLISECOND, 0)
        val start = cal.timeInMillis
        cal.add(Calendar.MONTH, 1)
        return start to cal.timeInMillis - 1
    }
}
