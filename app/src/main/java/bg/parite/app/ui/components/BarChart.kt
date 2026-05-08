package bg.parite.app.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

@Composable
fun BarChart(
    values: List<Float>,
    modifier: Modifier = Modifier,
    barColor: Color,
    emptyBarColor: Color = Color(0x14000000),
    cornerRadius: Dp = 4.dp,
) {
    Canvas(modifier = modifier) {
        if (values.isEmpty()) return@Canvas
        val max = values.maxOrNull()?.takeIf { it > 0 } ?: 1f
        val gap = 4.dp.toPx()
        val totalGapPx = gap * (values.size - 1)
        val barWidth = ((size.width - totalGapPx) / values.size).coerceAtLeast(1f)
        val radius = CornerRadius(cornerRadius.toPx(), cornerRadius.toPx())
        values.forEachIndexed { i, v ->
            val barH = (v / max) * size.height
            val x = i * (barWidth + gap)
            if (v > 0f) {
                drawRoundRect(
                    color = barColor,
                    topLeft = Offset(x, size.height - barH),
                    size = Size(barWidth, barH),
                    cornerRadius = radius,
                )
            } else {
                drawRoundRect(
                    color = emptyBarColor,
                    topLeft = Offset(x, size.height - 4.dp.toPx()),
                    size = Size(barWidth, 4.dp.toPx()),
                    cornerRadius = radius,
                )
            }
        }
    }
}
