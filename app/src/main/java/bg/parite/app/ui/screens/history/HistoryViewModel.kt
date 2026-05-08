package bg.parite.app.ui.screens.history

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import bg.parite.app.data.model.Account
import bg.parite.app.data.model.Category
import bg.parite.app.data.model.Transaction
import bg.parite.app.data.repo.AccountRepository
import bg.parite.app.data.repo.CategoryRepository
import bg.parite.app.data.repo.TransactionRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class HistoryUiState(
    val transactions: List<Transaction> = emptyList(),
    val accounts: Map<Long, Account> = emptyMap(),
    val categories: Map<Long, Category> = emptyMap(),
    val query: String = "",
)

class HistoryViewModel(
    private val txnRepo: TransactionRepository,
    accountRepo: AccountRepository,
    categoryRepo: CategoryRepository,
) : ViewModel() {

    private val query = MutableStateFlow("")

    val state: StateFlow<HistoryUiState> = combine(
        txnRepo.observeAll(),
        accountRepo.observeAll(),
        categoryRepo.observeAll(),
        query,
    ) { txns, accounts, categories, q ->
        val filtered = if (q.isBlank()) txns else {
            val needle = q.trim().lowercase()
            txns.filter { (it.note ?: "").lowercase().contains(needle) }
        }
        HistoryUiState(
            transactions = filtered,
            accounts = accounts.associateBy { it.id },
            categories = categories.associateBy { it.id },
            query = q,
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), HistoryUiState())

    fun setQuery(q: String) { query.value = q }

    private var lastDeleted: Transaction? = null

    fun delete(txn: Transaction) {
        lastDeleted = txn
        viewModelScope.launch { txnRepo.deleteById(txn.id) }
    }

    fun undoLastDelete() {
        val t = lastDeleted ?: return
        lastDeleted = null
        viewModelScope.launch { txnRepo.insert(t.copy(id = 0)) }
    }
}
