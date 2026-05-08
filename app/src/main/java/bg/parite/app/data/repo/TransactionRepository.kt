package bg.parite.app.data.repo

import bg.parite.app.data.db.AccountBalance
import bg.parite.app.data.db.CategoryTotal
import bg.parite.app.data.db.TransactionDao
import bg.parite.app.data.model.Transaction
import bg.parite.app.data.model.TxnType
import kotlinx.coroutines.flow.Flow

class TransactionRepository(private val dao: TransactionDao) {

    fun observeRecent(limit: Int = 20): Flow<List<Transaction>> = dao.observeRecent(limit)
    fun observeAll(): Flow<List<Transaction>> = dao.observeAll()
    fun observeBalances(): Flow<List<AccountBalance>> = dao.observeBalances()

    fun observeExpenseTotalBetween(from: Long, to: Long): Flow<Long> =
        dao.observeExpenseTotalBetween(from, to)

    fun observeTotalBetween(type: TxnType, from: Long, to: Long): Flow<Long> =
        dao.observeTotalBetween(type, from, to)

    fun observeBetween(from: Long, to: Long): Flow<List<Transaction>> =
        dao.observeBetween(from, to)

    fun observeCategoryTotals(type: TxnType, from: Long, to: Long): Flow<List<CategoryTotal>> =
        dao.observeCategoryTotals(type, from, to)

    fun observeTopCategoryIds(type: TxnType, since: Long, limit: Int): Flow<List<Long>> =
        dao.observeTopCategoryIds(type, since, limit)

    suspend fun byId(id: Long): Transaction? = dao.byId(id)
    suspend fun insert(txn: Transaction): Long = dao.insert(txn)
    suspend fun update(txn: Transaction) = dao.update(txn)
    suspend fun deleteById(id: Long) = dao.deleteById(id)
}
