package bg.parite.app.ui.screens.add

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import bg.parite.app.data.model.Account
import bg.parite.app.data.model.Category
import bg.parite.app.data.model.CategoryKind
import bg.parite.app.data.model.Money
import bg.parite.app.data.model.Transaction
import bg.parite.app.data.model.TxnType
import bg.parite.app.data.repo.AccountRepository
import bg.parite.app.data.repo.CategoryRepository
import bg.parite.app.data.repo.TransactionRepository
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.math.BigDecimal
import java.math.RoundingMode

enum class Op(val symbol: String) { ADD("+"), SUB("−"), MUL("×"), DIV("÷") }

data class AddUiState(
    val type: TxnType = TxnType.EXPENSE,
    val accounts: List<Account> = emptyList(),
    val categories: List<Category> = emptyList(),
    val topCategoryIds: List<Long> = emptyList(),
    val selectedAccountId: Long? = null,
    val selectedCategoryId: Long? = null,
    val note: String = "",
    val occurredAt: Long = System.currentTimeMillis(),
    val display: String = "",
    val accumulator: BigDecimal? = null,
    val pendingOp: Op? = null,
    val isEditing: Boolean = false,
)

class AddTransactionViewModel(
    private val txnRepo: TransactionRepository,
    accountRepo: AccountRepository,
    private val categoryRepo: CategoryRepository,
    private val editingId: Long? = null,
    initialType: TxnType? = null,
) : ViewModel() {

    private val _state = MutableStateFlow(
        AddUiState(
            type = initialType ?: TxnType.EXPENSE,
            isEditing = editingId != null,
        )
    )
    val state: StateFlow<AddUiState> = _state.asStateFlow()

    private var categoryJob: Job? = null
    private var topJob: Job? = null

    init {
        viewModelScope.launch {
            accountRepo.observeActive().collect { accounts ->
                _state.update { st ->
                    st.copy(
                        accounts = accounts,
                        selectedAccountId = st.selectedAccountId ?: accounts.firstOrNull()?.id,
                    )
                }
            }
        }
        observeCategoriesFor(_state.value.type)
        observeTopFor(_state.value.type)

        if (editingId != null) {
            viewModelScope.launch { loadEditing(editingId) }
        }
    }

    private suspend fun loadEditing(id: Long) {
        val t = txnRepo.byId(id) ?: return
        val major = Money(t.amountMinor).toBigDecimal(t.currency)
            .stripTrailingZeros().toPlainString().removeSuffix(".")
        _state.update { st ->
            st.copy(
                type = t.type,
                selectedAccountId = t.accountId,
                selectedCategoryId = t.categoryId,
                note = t.note ?: "",
                occurredAt = t.occurredAt,
                display = major,
                accumulator = null,
                pendingOp = null,
            )
        }
        observeCategoriesFor(t.type)
        observeTopFor(t.type)
    }

    fun setType(type: TxnType) {
        if (_state.value.type == type) return
        _state.update { it.copy(type = type, selectedCategoryId = null, categories = emptyList()) }
        observeCategoriesFor(type)
        observeTopFor(type)
    }

    private fun observeCategoriesFor(type: TxnType) {
        categoryJob?.cancel()
        val kind = if (type == TxnType.EXPENSE) CategoryKind.EXPENSE else CategoryKind.INCOME
        categoryJob = viewModelScope.launch {
            categoryRepo.observeByKind(kind).collect { cats ->
                _state.update { st ->
                    st.copy(
                        categories = cats,
                        selectedCategoryId = st.selectedCategoryId ?: cats.firstOrNull()?.id,
                    )
                }
            }
        }
    }

    private fun observeTopFor(type: TxnType) {
        topJob?.cancel()
        val sinceMillis = System.currentTimeMillis() - NINETY_DAYS_MS
        topJob = viewModelScope.launch {
            txnRepo.observeTopCategoryIds(type, sinceMillis, limit = 4).collect { ids ->
                _state.update { it.copy(topCategoryIds = ids) }
            }
        }
    }

    fun appendDigit(d: Char) {
        _state.update { st ->
            val next = when {
                st.display.isEmpty() && d == '.' -> "0."
                d == '.' && st.display.contains('.') -> st.display
                st.display == "0" && d != '.' -> d.toString()
                else -> st.display + d
            }
            st.copy(display = next.take(12))
        }
    }

    fun backspace() {
        _state.update { it.copy(display = it.display.dropLast(1)) }
    }

    fun pressOp(op: Op) {
        _state.update { st ->
            val cur = st.display.toBigDecimalOrNull()
            when {
                cur != null && st.accumulator != null && st.pendingOp != null -> {
                    val result = evaluate(st.accumulator, st.pendingOp, cur)
                    st.copy(accumulator = result, pendingOp = op, display = "")
                }
                cur != null && st.accumulator == null -> {
                    st.copy(accumulator = cur, pendingOp = op, display = "")
                }
                cur == null && st.accumulator != null -> {
                    st.copy(pendingOp = op)
                }
                else -> st
            }
        }
    }

    fun pressEquals() {
        _state.update { st ->
            val cur = st.display.toBigDecimalOrNull()
            if (cur != null && st.accumulator != null && st.pendingOp != null) {
                val result = evaluate(st.accumulator, st.pendingOp, cur)
                st.copy(
                    display = result.stripTrailingZeros().toPlainString().removeSuffix("."),
                    accumulator = null,
                    pendingOp = null,
                )
            } else st
        }
    }

    fun setAccount(id: Long) = _state.update { it.copy(selectedAccountId = id) }
    fun setCategory(id: Long) = _state.update { it.copy(selectedCategoryId = id) }
    fun setNote(value: String) = _state.update { it.copy(note = value) }
    fun setOccurredAt(at: Long) = _state.update { it.copy(occurredAt = at) }

    fun addCustomCategory(name: String, emoji: String, colorHex: String) {
        val cleanName = name.trim().take(24)
        val cleanEmoji = emoji.trim().ifBlank { "🏷️" }
        if (cleanName.isEmpty()) return
        viewModelScope.launch {
            val kind = if (_state.value.type == TxnType.EXPENSE) CategoryKind.EXPENSE else CategoryKind.INCOME
            val sortOrder = (_state.value.categories.maxOfOrNull { it.sortOrder } ?: 0) + 1
            val newId = categoryRepo.insert(
                Category(
                    name = cleanName,
                    nameKey = null,
                    kind = kind,
                    emoji = cleanEmoji,
                    colorHex = colorHex,
                    sortOrder = sortOrder,
                )
            )
            _state.update { it.copy(selectedCategoryId = newId) }
        }
    }

    private fun resolveAmount(): Money? {
        val s = _state.value
        val acc = s.accounts.firstOrNull { it.id == s.selectedAccountId } ?: return null
        val cur = s.display.toBigDecimalOrNull()
        val raw = when {
            cur != null && s.accumulator != null && s.pendingOp != null ->
                evaluate(s.accumulator, s.pendingOp, cur)
            cur != null -> cur
            s.accumulator != null && s.display.isEmpty() -> s.accumulator
            else -> return null
        }
        if (raw <= BigDecimal.ZERO) return null
        return Money.fromMajor(raw, acc.currency)
    }

    fun canSave(): Boolean {
        val s = _state.value
        return s.selectedAccountId != null &&
            s.selectedCategoryId != null &&
            resolveAmount() != null
    }

    fun save(onDone: () -> Unit) {
        val s = _state.value
        val acc = s.accounts.firstOrNull { it.id == s.selectedAccountId } ?: return
        val catId = s.selectedCategoryId ?: return
        val money = resolveAmount() ?: return

        viewModelScope.launch {
            if (editingId != null) {
                val existing = txnRepo.byId(editingId)
                if (existing != null) {
                    txnRepo.update(
                        existing.copy(
                            accountId = acc.id,
                            categoryId = catId,
                            type = s.type,
                            amountMinor = money.minor,
                            currency = acc.currency,
                            occurredAt = s.occurredAt,
                            note = s.note.ifBlank { null },
                        )
                    )
                }
            } else {
                txnRepo.insert(
                    Transaction(
                        accountId = acc.id,
                        categoryId = catId,
                        type = s.type,
                        amountMinor = money.minor,
                        currency = acc.currency,
                        occurredAt = s.occurredAt,
                        note = s.note.ifBlank { null },
                    )
                )
            }
            onDone()
        }
    }

    fun delete(onDone: () -> Unit) {
        val id = editingId ?: return
        viewModelScope.launch {
            txnRepo.deleteById(id)
            onDone()
        }
    }

    private fun evaluate(a: BigDecimal, op: Op, b: BigDecimal): BigDecimal = when (op) {
        Op.ADD -> a + b
        Op.SUB -> a - b
        Op.MUL -> a * b
        Op.DIV -> if (b == BigDecimal.ZERO) BigDecimal.ZERO else a.divide(b, 4, RoundingMode.HALF_UP)
    }

    private companion object {
        const val NINETY_DAYS_MS = 90L * 24 * 60 * 60 * 1000
    }
}
