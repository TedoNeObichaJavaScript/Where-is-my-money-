package bg.parite.app.ui.components

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

fun Modifier.softShadow(
    radius: Dp = 16.dp,
    cornerRadius: Dp = 22.dp,
    color: Color = Color.Black.copy(alpha = 0.06f),
): Modifier = this.shadow(
    elevation = radius,
    shape = RoundedCornerShape(cornerRadius),
    ambientColor = color,
    spotColor = color,
    clip = false,
)
