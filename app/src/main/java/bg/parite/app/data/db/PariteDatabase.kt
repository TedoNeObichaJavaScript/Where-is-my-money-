package bg.parite.app.data.db

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import androidx.sqlite.db.SupportSQLiteDatabase
import bg.parite.app.data.model.Account
import bg.parite.app.data.model.Category
import bg.parite.app.data.model.RecurringRule
import bg.parite.app.data.model.Transaction
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch
import net.zetetic.database.sqlcipher.SupportOpenHelperFactory

@Database(
    entities = [Account::class, Category::class, Transaction::class, RecurringRule::class],
    version = 1,
    exportSchema = true,
)
@TypeConverters(Converters::class)
abstract class PariteDatabase : RoomDatabase() {

    abstract fun accountDao(): AccountDao
    abstract fun categoryDao(): CategoryDao
    abstract fun transactionDao(): TransactionDao
    abstract fun recurringRuleDao(): RecurringRuleDao

    companion object {
        private const val DB_NAME = "parite.db"

        fun create(
            context: Context,
            passphrase: ByteArray,
            scope: CoroutineScope,
        ): PariteDatabase {
            System.loadLibrary("sqlcipher")
            val factory = SupportOpenHelperFactory(passphrase)

            lateinit var db: PariteDatabase
            db = Room.databaseBuilder(context, PariteDatabase::class.java, DB_NAME)
                .openHelperFactory(factory)
                .addCallback(object : Callback() {
                    override fun onCreate(connection: SupportSQLiteDatabase) {
                        super.onCreate(connection)
                        scope.launch { Seed.populate(db, context) }
                    }
                })
                .build()
            return db
        }
    }
}
