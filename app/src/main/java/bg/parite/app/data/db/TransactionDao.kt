package bg.parite.app.data.db

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import bg.parite.app.data.model.Transaction
import bg.parite.app.data.model.TxnType
import kotlinx.coroutines.flow.Flow

data class CategoryTotal(
    val categoryId: Long,
    val totalMinor: Long,
)

data class AccountBalance(
    val accountId: Long,
    val currency: String,
    val balanceMinor: Long,
)

@Dao
interface TransactionDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(txn: Transaction): Long

    @Update
    suspend fun update(txn: Transaction)

    @Query("SELECT * FROM transactions WHERE id = :id")
    suspend fun byId(id: Long): Transaction?

    @Query("DELETE FROM transactions WHERE id = :id")
    suspend fun deleteById(id: Long)

    @Query("DELETE FROM transactions")
    suspend fun wipe()

    @Query("SELECT * FROM transactions ORDER BY occurredAt DESC, id DESC LIMIT :limit")
    fun observeRecent(limit: Int): Flow<List<Transaction>>

    @Query("SELECT * FROM transactions ORDER BY occurredAt DESC, id DESC")
    fun observeAll(): Flow<List<Transaction>>

    @Query("""
        SELECT COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amountMinor ELSE 0 END), 0)
        FROM transactions
        WHERE occurredAt BETWEEN :from AND :to
    """)
    fun observeExpenseTotalBetween(from: Long, to: Long): Flow<Long>

    @Query("""
        SELECT accountId,
               currency,
               (SELECT openingMinor FROM accounts WHERE id = t.accountId) +
               COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amountMinor ELSE -amountMinor END), 0) AS balanceMinor
        FROM transactions t
        GROUP BY accountId, currency
    """)
    fun observeBalances(): Flow<List<AccountBalance>>

    @Query("""
        SELECT categoryId, SUM(amountMinor) AS totalMinor
        FROM transactions
        WHERE type = :type AND occurredAt BETWEEN :from AND :to
        GROUP BY categoryId
        ORDER BY totalMinor DESC
    """)
    fun observeCategoryTotals(type: TxnType, from: Long, to: Long): Flow<List<CategoryTotal>>

    @Query("""
        SELECT COALESCE(SUM(amountMinor), 0)
        FROM transactions
        WHERE type = :type AND occurredAt BETWEEN :from AND :to
    """)
    fun observeTotalBetween(type: TxnType, from: Long, to: Long): Flow<Long>

    @Query("""
        SELECT * FROM transactions
        WHERE occurredAt BETWEEN :from AND :to
        ORDER BY occurredAt
    """)
    fun observeBetween(from: Long, to: Long): Flow<List<Transaction>>

    @Query("""
        SELECT categoryId FROM transactions
        WHERE type = :type AND occurredAt >= :since
        GROUP BY categoryId
        ORDER BY COUNT(*) DESC, MAX(occurredAt) DESC
        LIMIT :limit
    """)
    fun observeTopCategoryIds(type: TxnType, since: Long, limit: Int): Flow<List<Long>>
}
