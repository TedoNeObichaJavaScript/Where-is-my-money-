package bg.parite.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

@Composable
fun PariteCard(
    modifier: Modifier = Modifier,
    cornerRadius: Dp = 22.dp,
    container: Color = MaterialTheme.colorScheme.surfaceContainer,
    shadowRadius: Dp = 14.dp,
    onClick: (() -> Unit)? = null,
    content: @Composable () -> Unit,
) {
    val shape = RoundedCornerShape(cornerRadius)
    val base = modifier
        .softShadow(radius = shadowRadius, cornerRadius = cornerRadius)
        .clip(shape)
        .background(container)
    val withClick = if (onClick != null) base.clickable(onClick = onClick) else base
    Column(modifier = withClick) { content() }
}
