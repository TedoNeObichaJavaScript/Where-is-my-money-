package bg.parite.app.data.prefs

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.settingsDataStore by preferencesDataStore(name = "parite_settings")

data class Settings(
    val biometricEnabled: Boolean = false,
    val displayCurrency: String? = null,
    val lastBackupAt: Long = 0,
    val themeKey: String? = null,
)

class SettingsRepository(private val context: Context) {

    private object Keys {
        val BIOMETRIC = booleanPreferencesKey("biometric_enabled")
        val DISPLAY_CCY = stringPreferencesKey("display_currency")
        val LAST_BACKUP = longPreferencesKey("last_backup_at")
        val THEME = stringPreferencesKey("theme_key")
    }

    val settings: Flow<Settings> = context.settingsDataStore.data.map { p ->
        Settings(
            biometricEnabled = p[Keys.BIOMETRIC] ?: false,
            displayCurrency = p[Keys.DISPLAY_CCY],
            lastBackupAt = p[Keys.LAST_BACKUP] ?: 0,
            themeKey = p[Keys.THEME],
        )
    }

    suspend fun setBiometricEnabled(value: Boolean) {
        context.settingsDataStore.edit { it[Keys.BIOMETRIC] = value }
    }

    suspend fun setDisplayCurrency(code: String) {
        context.settingsDataStore.edit { it[Keys.DISPLAY_CCY] = code }
    }

    suspend fun markBackedUp(at: Long = System.currentTimeMillis()) {
        context.settingsDataStore.edit { it[Keys.LAST_BACKUP] = at }
    }

    suspend fun setThemeKey(key: String) {
        context.settingsDataStore.edit { it[Keys.THEME] = key }
    }
}
