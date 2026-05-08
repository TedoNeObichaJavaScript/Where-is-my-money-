package bg.parite.app.ui.theme

import androidx.compose.material3.ColorScheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color

private val Coral       = Color(0xFFE07A5F)
private val CoralSoft   = Color(0xFFF2A98F)
private val CoralDeep   = Color(0xFFB85F45)

private val Sage        = Color(0xFF7BA98C)
private val SageSoft    = Color(0xFFB6D4BD)
private val SageDeep    = Color(0xFF4F7E63)

private val Cream       = Color(0xFFFAF6F1)
private val CreamSurf   = Color(0xFFF1ECE6)
private val CreamSurfHi = Color(0xFFE8E1D7)
private val InkSoft     = Color(0xFF3D3A36)
private val InkMuted    = Color(0xFF6B6660)

private val Night       = Color(0xFF1A1816)
private val NightSurf   = Color(0xFF24211E)
private val NightSurfHi = Color(0xFF2F2B27)
private val Bone        = Color(0xFFEDE8E1)
private val BoneMuted   = Color(0xFFB6AFA6)

val LightColors: ColorScheme = lightColorScheme(
    primary = Coral,
    onPrimary = Color.White,
    primaryContainer = CoralSoft,
    onPrimaryContainer = CoralDeep,
    secondary = Sage,
    onSecondary = Color.White,
    secondaryContainer = SageSoft,
    onSecondaryContainer = SageDeep,
    tertiary = Color(0xFFD4A24C),
    onTertiary = Color.White,
    background = Cream,
    onBackground = InkSoft,
    surface = Cream,
    onSurface = InkSoft,
    surfaceVariant = CreamSurf,
    onSurfaceVariant = InkMuted,
    surfaceContainer = CreamSurf,
    surfaceContainerHigh = CreamSurfHi,
    outline = Color(0xFFCFC8BE),
    outlineVariant = Color(0xFFE3DDD3),
)

val DarkColors: ColorScheme = darkColorScheme(
    primary = CoralSoft,
    onPrimary = Color(0xFF3A1A0E),
    primaryContainer = CoralDeep,
    onPrimaryContainer = Color(0xFFFFE3D8),
    secondary = SageSoft,
    onSecondary = Color(0xFF0F2A1B),
    secondaryContainer = SageDeep,
    onSecondaryContainer = Color(0xFFD9EEDF),
    tertiary = Color(0xFFE8C07A),
    onTertiary = Color(0xFF3A2A0E),
    background = Night,
    onBackground = Bone,
    surface = Night,
    onSurface = Bone,
    surfaceVariant = NightSurf,
    onSurfaceVariant = BoneMuted,
    surfaceContainer = NightSurf,
    surfaceContainerHigh = NightSurfHi,
    outline = Color(0xFF5A554F),
    outlineVariant = Color(0xFF3D3A36),
)
