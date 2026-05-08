package bg.parite.app.ui.theme

import androidx.compose.material3.ColorScheme
import androidx.compose.ui.graphics.Color
import bg.parite.app.R

enum class PariteThemeId(
    val key: String,
    val labelRes: Int,
    val swatchHex: String,
) {
    CORAL  ("coral",  R.string.theme_coral,  "#E07A5F"),
    OCEAN  ("ocean",  R.string.theme_ocean,  "#3F88C5"),
    FOREST ("forest", R.string.theme_forest, "#3F8F5E"),
    SUNSET ("sunset", R.string.theme_sunset, "#D85B83"),
    MONO   ("mono",   R.string.theme_mono,   "#5A6A7A");

    companion object {
        val DEFAULT = CORAL
        fun fromKey(key: String?): PariteThemeId =
            entries.firstOrNull { it.key == key } ?: DEFAULT
    }
}

fun colorSchemeFor(id: PariteThemeId, dark: Boolean): ColorScheme = when (id) {
    PariteThemeId.CORAL  -> if (dark) DarkColors    else LightColors
    PariteThemeId.OCEAN  -> if (dark) OceanDark     else OceanLight
    PariteThemeId.FOREST -> if (dark) ForestDark    else ForestLight
    PariteThemeId.SUNSET -> if (dark) SunsetDark    else SunsetLight
    PariteThemeId.MONO   -> if (dark) MonoDark      else MonoLight
}

private val OceanLight = LightColors.copy(
    primary             = Color(0xFF3F88C5),
    onPrimary           = Color.White,
    primaryContainer    = Color(0xFFB7D5EC),
    onPrimaryContainer  = Color(0xFF1F4C73),
    secondary           = Color(0xFF5FB89C),
    onSecondary         = Color.White,
    secondaryContainer  = Color(0xFFC0E1D2),
    onSecondaryContainer= Color(0xFF275947),
    tertiary            = Color(0xFFE4B85E),
    background          = Color(0xFFF1F6FA),
    onBackground        = Color(0xFF1F2A33),
    surface             = Color(0xFFF1F6FA),
    onSurface           = Color(0xFF1F2A33),
    surfaceVariant      = Color(0xFFE4ECF3),
    onSurfaceVariant    = Color(0xFF566773),
    surfaceContainer    = Color(0xFFE4ECF3),
    surfaceContainerHigh= Color(0xFFD4DFE9),
    outline             = Color(0xFFA9B6C2),
    outlineVariant      = Color(0xFFD4DFE9),
)

private val OceanDark = DarkColors.copy(
    primary             = Color(0xFF8FBFE2),
    onPrimary           = Color(0xFF0E2942),
    primaryContainer    = Color(0xFF255374),
    onPrimaryContainer  = Color(0xFFD7E8F5),
    secondary           = Color(0xFF9DD4BF),
    onSecondary         = Color(0xFF103625),
    secondaryContainer  = Color(0xFF2F6651),
    onSecondaryContainer= Color(0xFFD7EFE5),
    tertiary            = Color(0xFFEDC97A),
    background          = Color(0xFF101820),
    onBackground        = Color(0xFFE3EDF5),
    surface             = Color(0xFF101820),
    onSurface           = Color(0xFFE3EDF5),
    surfaceVariant      = Color(0xFF1A242E),
    onSurfaceVariant    = Color(0xFFA8B6C2),
    surfaceContainer    = Color(0xFF1A242E),
    surfaceContainerHigh= Color(0xFF243140),
    outline             = Color(0xFF4F5C6A),
    outlineVariant      = Color(0xFF2D3845),
)

private val ForestLight = LightColors.copy(
    primary             = Color(0xFF3F8F5E),
    onPrimary           = Color.White,
    primaryContainer    = Color(0xFFB6D9C2),
    onPrimaryContainer  = Color(0xFF1E5236),
    secondary           = Color(0xFFA07355),
    onSecondary         = Color.White,
    secondaryContainer  = Color(0xFFE0CDBC),
    onSecondaryContainer= Color(0xFF5C3F26),
    tertiary            = Color(0xFFD4A24C),
    background          = Color(0xFFF6F1E8),
    onBackground        = Color(0xFF2C2A1F),
    surface             = Color(0xFFF6F1E8),
    onSurface           = Color(0xFF2C2A1F),
    surfaceVariant      = Color(0xFFEAE4D6),
    onSurfaceVariant    = Color(0xFF66604D),
    surfaceContainer    = Color(0xFFEAE4D6),
    surfaceContainerHigh= Color(0xFFDAD3C2),
    outline             = Color(0xFFB6AE99),
    outlineVariant      = Color(0xFFDAD3C2),
)

private val ForestDark = DarkColors.copy(
    primary             = Color(0xFFA1D2B1),
    onPrimary           = Color(0xFF0E2C1A),
    primaryContainer    = Color(0xFF285C3F),
    onPrimaryContainer  = Color(0xFFD9EFE0),
    secondary           = Color(0xFFD3B295),
    onSecondary         = Color(0xFF3A2511),
    secondaryContainer  = Color(0xFF6B4B2E),
    onSecondaryContainer= Color(0xFFEFDFCE),
    tertiary            = Color(0xFFE8C07A),
    background          = Color(0xFF181612),
    onBackground        = Color(0xFFEDE7DA),
    surface             = Color(0xFF181612),
    onSurface           = Color(0xFFEDE7DA),
    surfaceVariant      = Color(0xFF22201A),
    onSurfaceVariant    = Color(0xFFB9B19D),
    surfaceContainer    = Color(0xFF22201A),
    surfaceContainerHigh= Color(0xFF2D2A22),
    outline             = Color(0xFF565143),
    outlineVariant      = Color(0xFF383428),
)

private val SunsetLight = LightColors.copy(
    primary             = Color(0xFFD85B83),
    onPrimary           = Color.White,
    primaryContainer    = Color(0xFFF6BFD0),
    onPrimaryContainer  = Color(0xFF7E2D49),
    secondary           = Color(0xFFF2A33A),
    onSecondary         = Color.White,
    secondaryContainer  = Color(0xFFFCD9A8),
    onSecondaryContainer= Color(0xFF7A4B0F),
    tertiary            = Color(0xFFB17BC7),
    background          = Color(0xFFFBF4ED),
    onBackground        = Color(0xFF382B2A),
    surface             = Color(0xFFFBF4ED),
    onSurface           = Color(0xFF382B2A),
    surfaceVariant      = Color(0xFFF1E6DA),
    onSurfaceVariant    = Color(0xFF6E5F58),
    surfaceContainer    = Color(0xFFF1E6DA),
    surfaceContainerHigh= Color(0xFFE6D5C3),
    outline             = Color(0xFFC8B6A6),
    outlineVariant      = Color(0xFFE6D5C3),
)

private val SunsetDark = DarkColors.copy(
    primary             = Color(0xFFF6A2BB),
    onPrimary           = Color(0xFF40132A),
    primaryContainer    = Color(0xFF8C3556),
    onPrimaryContainer  = Color(0xFFFFD9E3),
    secondary           = Color(0xFFFAC988),
    onSecondary         = Color(0xFF3F2509),
    secondaryContainer  = Color(0xFF80541E),
    onSecondaryContainer= Color(0xFFFEE3C2),
    tertiary            = Color(0xFFD3ABE0),
    background          = Color(0xFF1A1414),
    onBackground        = Color(0xFFEEDED4),
    surface             = Color(0xFF1A1414),
    onSurface           = Color(0xFFEEDED4),
    surfaceVariant      = Color(0xFF251D1B),
    onSurfaceVariant    = Color(0xFFC2AFA3),
    surfaceContainer    = Color(0xFF251D1B),
    surfaceContainerHigh= Color(0xFF302623),
    outline             = Color(0xFF60534D),
    outlineVariant      = Color(0xFF3A302C),
)

private val MonoLight = LightColors.copy(
    primary             = Color(0xFF5A6A7A),
    onPrimary           = Color.White,
    primaryContainer    = Color(0xFFD4DCE4),
    onPrimaryContainer  = Color(0xFF323D49),
    secondary           = Color(0xFF9A8E7C),
    onSecondary         = Color.White,
    secondaryContainer  = Color(0xFFDED4C4),
    onSecondaryContainer= Color(0xFF55493A),
    tertiary            = Color(0xFFB07A60),
    background          = Color(0xFFF4F4F2),
    onBackground        = Color(0xFF2C2D2E),
    surface             = Color(0xFFF4F4F2),
    onSurface           = Color(0xFF2C2D2E),
    surfaceVariant      = Color(0xFFE7E7E4),
    onSurfaceVariant    = Color(0xFF5C5E60),
    surfaceContainer    = Color(0xFFE7E7E4),
    surfaceContainerHigh= Color(0xFFD7D7D3),
    outline             = Color(0xFFB1B1AC),
    outlineVariant      = Color(0xFFD7D7D3),
)

private val MonoDark = DarkColors.copy(
    primary             = Color(0xFFAEBCC9),
    onPrimary           = Color(0xFF1F2932),
    primaryContainer    = Color(0xFF3A4651),
    onPrimaryContainer  = Color(0xFFE0E7EE),
    secondary           = Color(0xFFCFC1AA),
    onSecondary         = Color(0xFF312814),
    secondaryContainer  = Color(0xFF5E5240),
    onSecondaryContainer= Color(0xFFEBE0CC),
    tertiary            = Color(0xFFE0AC93),
    background          = Color(0xFF15171A),
    onBackground        = Color(0xFFEAEBEC),
    surface             = Color(0xFF15171A),
    onSurface           = Color(0xFFEAEBEC),
    surfaceVariant      = Color(0xFF1F2226),
    onSurfaceVariant    = Color(0xFFB1B4B7),
    surfaceContainer    = Color(0xFF1F2226),
    surfaceContainerHigh= Color(0xFF2A2D31),
    outline             = Color(0xFF55585C),
    outlineVariant      = Color(0xFF323539),
)
