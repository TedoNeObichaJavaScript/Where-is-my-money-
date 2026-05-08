package bg.parite.app.widget

import android.content.Context
import android.content.Intent
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.LocalContext
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.action.actionStartActivity
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.layout.width
import androidx.glance.text.FontFamily
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import bg.parite.app.MainActivity
import bg.parite.app.R

private val Cream    = Color(0xFFFAF6F1)
private val Ink      = Color(0xFF3D3A36)
private val InkMuted = Color(0xFF6B6660)
private val Coral    = Color(0xFFE07A5F)
private val Sage     = Color(0xFF7BA98C)
private val Surface  = Color(0xFFF1ECE6)

class PariteWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent { WidgetContent() }
    }
}

@Composable
private fun WidgetContent() {
    val context = LocalContext.current

    Column(
        modifier = GlanceModifier
            .fillMaxSize()
            .background(Cream)
            .cornerRadius(20.dp)
            .padding(12.dp)
            .clickable(actionStartActivity(openAppIntent(context))),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            text = context.getString(R.string.widget_title),
            style = TextStyle(
                color = ColorProvider(Ink),
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium,
                fontFamily = FontFamily.SansSerif,
            ),
        )
        Spacer(GlanceModifier.height(2.dp))
        Text(
            text = context.getString(R.string.widget_tagline),
            style = TextStyle(
                color = ColorProvider(InkMuted),
                fontSize = 11.sp,
                fontFamily = FontFamily.SansSerif,
            ),
        )
        Spacer(GlanceModifier.height(10.dp))
        Row(modifier = GlanceModifier.fillMaxWidth().height(48.dp)) {
            QuickButton(
                label = context.getString(R.string.widget_expense),
                background = Coral,
                onClick = actionStartActivity(quickAddIntent(context, "EXPENSE")),
                modifier = GlanceModifier.defaultWeight().fillMaxSize(),
            )
            Spacer(GlanceModifier.width(8.dp))
            QuickButton(
                label = context.getString(R.string.widget_income),
                background = Sage,
                onClick = actionStartActivity(quickAddIntent(context, "INCOME")),
                modifier = GlanceModifier.defaultWeight().fillMaxSize(),
            )
        }
    }
}

@Composable
private fun QuickButton(
    label: String,
    background: Color,
    onClick: androidx.glance.action.Action,
    modifier: GlanceModifier,
) {
    Box(
        modifier = modifier
            .background(background)
            .cornerRadius(14.dp)
            .clickable(onClick),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text = label,
            style = TextStyle(
                color = ColorProvider(Color.White),
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.SansSerif,
            ),
        )
    }
}

private fun quickAddIntent(context: Context, type: String): Intent =
    Intent(context, MainActivity::class.java).apply {
        action = Intent.ACTION_VIEW
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        putExtra(MainActivity.EXTRA_LAUNCH_TARGET, "add")
        putExtra(MainActivity.EXTRA_INITIAL_TYPE, type)
    }

private fun openAppIntent(context: Context): Intent =
    Intent(context, MainActivity::class.java).apply {
        action = Intent.ACTION_MAIN
        addCategory(Intent.CATEGORY_LAUNCHER)
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
    }
