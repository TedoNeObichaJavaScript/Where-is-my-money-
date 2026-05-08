package bg.parite.app.ui.screens.settings

import android.text.format.DateUtils
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Backup
import androidx.compose.material.icons.outlined.Fingerprint
import androidx.compose.material.icons.outlined.RestorePage
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import bg.parite.app.R
import bg.parite.app.security.BiometricGate
import bg.parite.app.ui.theme.PariteThemeId
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(viewModel: SettingsViewModel) {
    val context = LocalContext.current
    val state by viewModel.settings.collectAsState()
    var showRestoreConfirm by remember { mutableStateOf<android.net.Uri?>(null) }

    DisposableEffect(viewModel) {
        viewModel.onEvent { ev ->
            val msg = when (ev) {
                is SettingsEvent.BackupOk -> context.getString(R.string.backup_success, ev.result.transactions)
                is SettingsEvent.BackupErr -> context.getString(R.string.backup_failed, ev.message)
                is SettingsEvent.RestoreOk -> context.getString(R.string.restore_success, ev.result.transactions)
                is SettingsEvent.RestoreErr -> context.getString(R.string.restore_failed, ev.message)
            }
            Toast.makeText(context, msg, Toast.LENGTH_LONG).show()
        }
        onDispose { viewModel.clearEventHandlers() }
    }

    val createBackup = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.CreateDocument("application/json"),
    ) { uri -> uri?.let { viewModel.backupTo(context, it) } }

    val openRestore = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.OpenDocument(),
    ) { uri -> uri?.let { showRestoreConfirm = it } }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(stringResource(R.string.settings_title)) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background,
                ),
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background),
            contentPadding = PaddingValues(
                start = 20.dp, end = 20.dp,
                top = padding.calculateTopPadding() + 8.dp,
                bottom = padding.calculateBottomPadding() + 24.dp,
            ),
            verticalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            item { SectionLabel(stringResource(R.string.settings_section_appearance)) }
            item {
                SectionCard {
                    ThemePickerRow(
                        selected = PariteThemeId.fromKey(state.themeKey),
                        onSelect = { viewModel.setTheme(it.key) },
                    )
                }
            }

            item { SectionLabel(stringResource(R.string.settings_section_security)) }
            item {
                SectionCard {
                    SwitchRow(
                        icon = Icons.Outlined.Fingerprint,
                        title = stringResource(R.string.settings_lock_with_biometric),
                        subtitle = stringResource(R.string.settings_lock_with_biometric_desc),
                        checked = state.biometricEnabled,
                        enabled = BiometricGate.isAvailable(context),
                        onCheckedChange = { wantsOn ->
                            if (wantsOn && !BiometricGate.isAvailable(context)) {
                                Toast.makeText(
                                    context,
                                    context.getString(R.string.biometric_unavailable),
                                    Toast.LENGTH_LONG,
                                ).show()
                            } else {
                                viewModel.setBiometric(wantsOn)
                            }
                        },
                    )
                }
            }

            item { SectionLabel(stringResource(R.string.settings_section_data)) }
            item {
                SectionCard {
                    ActionRow(
                        icon = Icons.Outlined.Backup,
                        title = stringResource(R.string.settings_backup_now),
                        subtitle = formatLastBackup(state.lastBackupAt),
                        onClick = { createBackup.launch(suggestedBackupFilename()) },
                    )
                    HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                    ActionRow(
                        icon = Icons.Outlined.RestorePage,
                        title = stringResource(R.string.settings_restore),
                        subtitle = stringResource(R.string.settings_restore_desc),
                        onClick = { openRestore.launch(arrayOf("application/json", "*/*")) },
                    )
                }
            }

            item { SectionLabel(stringResource(R.string.settings_section_about)) }
            item {
                SectionCard {
                    InfoRow(
                        title = stringResource(R.string.app_name),
                        subtitle = stringResource(R.string.settings_about_desc, "0.1.0"),
                    )
                }
            }
        }

        showRestoreConfirm?.let { uri ->
            AlertDialog(
                onDismissRequest = { showRestoreConfirm = null },
                title = { Text(stringResource(R.string.restore_confirm_title)) },
                text = { Text(stringResource(R.string.restore_confirm_msg)) },
                confirmButton = {
                    TextButton(onClick = {
                        viewModel.restoreFrom(context, uri)
                        showRestoreConfirm = null
                    }) { Text(stringResource(R.string.restore_confirm_ok)) }
                },
                dismissButton = {
                    TextButton(onClick = { showRestoreConfirm = null }) {
                        Text(stringResource(R.string.add_cancel))
                    }
                },
            )
        }
    }
}

@Composable
private fun ThemePickerRow(
    selected: PariteThemeId,
    onSelect: (PariteThemeId) -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        Text(
            stringResource(R.string.settings_theme),
            style = MaterialTheme.typography.bodyLarge,
            fontWeight = FontWeight.Medium,
        )
        Text(
            stringResource(R.string.settings_theme_desc),
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Row(
            horizontalArrangement = Arrangement.spacedBy(14.dp),
            modifier = Modifier.padding(top = 4.dp),
        ) {
            PariteThemeId.entries.forEach { id ->
                ThemeSwatch(
                    id = id,
                    isSelected = id == selected,
                    onClick = { onSelect(id) },
                )
            }
        }
    }
}

@Composable
private fun ThemeSwatch(
    id: PariteThemeId,
    isSelected: Boolean,
    onClick: () -> Unit,
) {
    val swatchColor = remember(id) { Color(android.graphics.Color.parseColor(id.swatchHex)) }
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(4.dp),
        modifier = Modifier.clickable(onClick = onClick),
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(swatchColor, CircleShape)
                .border(
                    width = if (isSelected) 3.dp else 0.dp,
                    color = MaterialTheme.colorScheme.onBackground,
                    shape = CircleShape,
                ),
        )
        Text(
            stringResource(id.labelRes),
            style = MaterialTheme.typography.labelSmall,
            color = if (isSelected) MaterialTheme.colorScheme.onSurface
                    else MaterialTheme.colorScheme.onSurfaceVariant,
            fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal,
        )
    }
}

@Composable
private fun SectionLabel(text: String) {
    Text(
        text,
        style = MaterialTheme.typography.labelMedium,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        modifier = Modifier.padding(top = 8.dp, start = 4.dp),
    )
}

@Composable
private fun SectionCard(content: @Composable () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceContainer,
        ),
    ) { Column { content() } }
}

@Composable
private fun SwitchRow(
    icon: ImageVector,
    title: String,
    subtitle: String,
    checked: Boolean,
    enabled: Boolean,
    onCheckedChange: (Boolean) -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        IconBadge(icon)
        Spacer(Modifier.size(14.dp))
        Column(Modifier.weight(1f)) {
            Text(title, style = MaterialTheme.typography.bodyLarge, fontWeight = FontWeight.Medium)
            Text(
                subtitle,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        Switch(checked = checked, onCheckedChange = onCheckedChange, enabled = enabled)
    }
}

@Composable
private fun ActionRow(
    icon: ImageVector,
    title: String,
    subtitle: String,
    onClick: () -> Unit,
) {
    Surface(
        onClick = onClick,
        color = MaterialTheme.colorScheme.surfaceContainer,
        modifier = Modifier.fillMaxWidth(),
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            IconBadge(icon)
            Spacer(Modifier.size(14.dp))
            Column(Modifier.weight(1f)) {
                Text(title, style = MaterialTheme.typography.bodyLarge, fontWeight = FontWeight.Medium)
                Text(
                    subtitle,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}

@Composable
private fun InfoRow(title: String, subtitle: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.weight(1f)) {
            Text(title, style = MaterialTheme.typography.bodyLarge, fontWeight = FontWeight.Medium)
            Text(
                subtitle,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}

@Composable
private fun IconBadge(icon: ImageVector) {
    Surface(
        shape = RoundedCornerShape(12.dp),
        color = MaterialTheme.colorScheme.surfaceContainerHigh,
        modifier = Modifier.size(40.dp),
    ) {
        Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
            Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.onSurface)
        }
    }
}

@Composable
private fun formatLastBackup(at: Long): String {
    if (at <= 0) return stringResource(R.string.settings_backup_never)
    val rel = DateUtils.getRelativeTimeSpanString(
        at, System.currentTimeMillis(), DateUtils.MINUTE_IN_MILLIS,
    ).toString()
    return stringResource(R.string.settings_backup_last_at, rel)
}

private fun suggestedBackupFilename(): String {
    val date = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
    return "parite-backup-$date.json"
}
