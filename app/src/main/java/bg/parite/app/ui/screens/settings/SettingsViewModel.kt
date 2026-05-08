package bg.parite.app.ui.screens.settings

import android.content.Context
import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import bg.parite.app.data.backup.BackupResult
import bg.parite.app.data.backup.BackupService
import bg.parite.app.data.prefs.Settings
import bg.parite.app.data.prefs.SettingsRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

sealed interface SettingsEvent {
    data class BackupOk(val result: BackupResult) : SettingsEvent
    data class BackupErr(val message: String) : SettingsEvent
    data class RestoreOk(val result: BackupResult) : SettingsEvent
    data class RestoreErr(val message: String) : SettingsEvent
}

class SettingsViewModel(
    private val settingsRepo: SettingsRepository,
    private val backupService: BackupService,
) : ViewModel() {

    val settings: StateFlow<Settings> = settingsRepo.settings
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), Settings())

    private val _events = mutableListOf<(SettingsEvent) -> Unit>()
    fun onEvent(handler: (SettingsEvent) -> Unit) { _events += handler }
    fun clearEventHandlers() { _events.clear() }
    private fun emit(e: SettingsEvent) { _events.forEach { it(e) } }

    fun setBiometric(enabled: Boolean) {
        viewModelScope.launch { settingsRepo.setBiometricEnabled(enabled) }
    }

    fun setTheme(key: String) {
        viewModelScope.launch { settingsRepo.setThemeKey(key) }
    }

    fun backupTo(context: Context, uri: Uri) {
        viewModelScope.launch {
            backupService.export(context, uri)
                .onSuccess {
                    settingsRepo.markBackedUp()
                    emit(SettingsEvent.BackupOk(it))
                }
                .onFailure { emit(SettingsEvent.BackupErr(it.message ?: "unknown")) }
        }
    }

    fun restoreFrom(context: Context, uri: Uri) {
        viewModelScope.launch {
            backupService.importReplace(context, uri)
                .onSuccess { emit(SettingsEvent.RestoreOk(it)) }
                .onFailure { emit(SettingsEvent.RestoreErr(it.message ?: "unknown")) }
        }
    }
}
