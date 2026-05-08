package bg.parite.app

import android.content.Intent
import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import bg.parite.app.data.model.TxnType
import bg.parite.app.security.BiometricGate
import bg.parite.app.ui.nav.LaunchTarget
import bg.parite.app.ui.nav.PariteNav
import bg.parite.app.ui.theme.PariteTheme
import bg.parite.app.ui.theme.PariteThemeId
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.map

class MainActivity : FragmentActivity() {

    private val launchTarget = MutableStateFlow<LaunchTarget?>(null)

    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        launchTarget.value = parseLaunchTarget(intent)

        val container = (application as PariteApp).container
        val biometricEnabled = container.settingsRepository.settings.map { it.biometricEnabled }
        val themeIdFlow = container.settingsRepository.settings
            .map { PariteThemeId.fromKey(it.themeKey) }

        setContent {
            val themeId by themeIdFlow.collectAsStateWithLifecycle(initialValue = PariteThemeId.DEFAULT)

            PariteTheme(themeId = themeId) {
                val enabled by biometricEnabled.collectAsStateWithLifecycle(initialValue = false)
                val context = LocalContext.current
                val available = remember(enabled) { enabled && BiometricGate.isAvailable(context) }
                var unlocked by remember { mutableStateOf(false) }

                LaunchedEffect(available) {
                    if (!available) unlocked = true
                }

                if (unlocked) {
                    PariteNav(container = container, launchTarget = launchTarget)
                } else {
                    LockScreen(onUnlock = {
                        BiometricGate.prompt(
                            activity = this@MainActivity,
                            title = getString(R.string.biometric_prompt_title),
                            subtitle = getString(R.string.biometric_prompt_subtitle),
                            onSuccess = { unlocked = true },
                            onFailureOrCancel = { /* stay locked */ },
                        )
                    })

                    LaunchedEffect(Unit) {
                        BiometricGate.prompt(
                            activity = this@MainActivity,
                            title = getString(R.string.biometric_prompt_title),
                            subtitle = getString(R.string.biometric_prompt_subtitle),
                            onSuccess = { unlocked = true },
                            onFailureOrCancel = { /* stay locked */ },
                        )
                    }
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        parseLaunchTarget(intent)?.let { launchTarget.value = it }
    }

    private fun parseLaunchTarget(intent: Intent?): LaunchTarget? {
        if (intent?.getStringExtra(EXTRA_LAUNCH_TARGET) != "add") return null
        val type = when (intent.getStringExtra(EXTRA_INITIAL_TYPE)) {
            "INCOME" -> TxnType.INCOME
            else -> TxnType.EXPENSE
        }
        return LaunchTarget.AddTyped(type, ts = System.currentTimeMillis())
    }

    companion object {
        const val EXTRA_LAUNCH_TARGET = "LAUNCH_TARGET"
        const val EXTRA_INITIAL_TYPE = "INITIAL_TYPE"
    }
}

@Composable
private fun LockScreen(onUnlock: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(32.dp),
        contentAlignment = Alignment.Center,
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            Text(
                "🔒",
                style = MaterialTheme.typography.displayMedium,
            )
            Spacer(Modifier.height(16.dp))
            Text(
                stringResource(R.string.app_name),
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.SemiBold,
            )
            Spacer(Modifier.height(32.dp))
            Button(
                onClick = onUnlock,
                shape = RoundedCornerShape(20.dp),
            ) {
                Text(stringResource(R.string.biometric_unlock_button))
            }
        }
    }
}
