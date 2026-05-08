package bg.parite.app.di

import android.content.Context
import bg.parite.app.data.backup.BackupService
import bg.parite.app.data.db.PariteDatabase
import bg.parite.app.data.prefs.SettingsRepository
import bg.parite.app.data.repo.AccountRepository
import bg.parite.app.data.repo.CategoryRepository
import bg.parite.app.data.repo.TransactionRepository
import bg.parite.app.security.KeystoreHelper
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob

class AppContainer(context: Context) {

    val applicationScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    private val keystore = KeystoreHelper(context)
    private val passphrase = keystore.getOrCreateDbPassphrase()

    private val database = PariteDatabase.create(context, passphrase, applicationScope)

    val accountRepository = AccountRepository(database.accountDao())
    val categoryRepository = CategoryRepository(database.categoryDao())
    val transactionRepository = TransactionRepository(database.transactionDao())

    val settingsRepository = SettingsRepository(context)
    val backupService = BackupService(database)
}
