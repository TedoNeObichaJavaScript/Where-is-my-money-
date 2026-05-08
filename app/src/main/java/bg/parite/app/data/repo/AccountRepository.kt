package bg.parite.app.data.repo

import bg.parite.app.data.db.AccountDao
import bg.parite.app.data.model.Account
import kotlinx.coroutines.flow.Flow

class AccountRepository(private val dao: AccountDao) {
    fun observeActive(): Flow<List<Account>> = dao.observeActive()
    fun observeAll(): Flow<List<Account>> = dao.observeAll()
    suspend fun byId(id: Long) = dao.byId(id)
    suspend fun insert(account: Account) = dao.insert(account)
    suspend fun update(account: Account) = dao.update(account)
}
