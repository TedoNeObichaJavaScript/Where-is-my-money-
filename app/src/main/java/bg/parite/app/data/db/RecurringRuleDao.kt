package bg.parite.app.data.db

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import bg.parite.app.data.model.RecurringRule
import kotlinx.coroutines.flow.Flow

@Dao
interface RecurringRuleDao {
    @Query("SELECT * FROM recurring_rules WHERE active = 1 ORDER BY nextDueAt")
    fun observeActive(): Flow<List<RecurringRule>>

    @Query("SELECT * FROM recurring_rules WHERE active = 1 AND nextDueAt <= :now")
    suspend fun dueAt(now: Long): List<RecurringRule>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(rule: RecurringRule): Long

    @Update
    suspend fun update(rule: RecurringRule)

    @Query("DELETE FROM recurring_rules")
    suspend fun wipe()
}
