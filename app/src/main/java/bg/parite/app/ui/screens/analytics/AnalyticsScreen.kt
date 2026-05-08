package bg.parite.app.ui.screens.analytics

import androidx.compose.foundation.background
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
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material.icons.automirrored.outlined.ArrowForward
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import bg.parite.app.R
import bg.parite.app.data.model.Money
import bg.parite.app.ui.components.BarChart
import bg.parite.app.ui.components.Donut
import bg.parite.app.ui.components.DonutSlice
import bg.parite.app.ui.components.PariteCard
import bg.parite.app.ui.components.PariteLargeTopBar

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AnalyticsScreen(viewModel: AnalyticsViewModel) {
    val s by viewModel.state.collectAsState()

    Scaffold(
        topBar = {
            PariteLargeTopBar(title = stringResource(R.string.analytics_title))
        },
        containerColor = MaterialTheme.colorScheme.background,
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background),
            contentPadding = PaddingValues(
                start = 20.dp, end = 20.dp,
                top = padding.calculateTopPadding(),
                bottom = padding.calculateBottomPadding() + 24.dp,
            ),
            verticalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            item {
                MonthSelector(
                    label = s.monthLabel,
                    canGoBack = true,
                    canGoForward = !s.isFutureMonth && !s.isCurrentMonth,
                    onPrev = viewModel::previousMonth,
                    onNext = viewModel::nextMonth,
                )
            }
            item { TotalsRow(s) }
            item { CategoryDonutCard(s) }
            item { DailyBarCard(s) }
            item { TopCategoriesCard(s) }
        }
    }
}

@Composable
private fun MonthSelector(
    label: String,
    canGoBack: Boolean,
    canGoForward: Boolean,
    onPrev: () -> Unit,
    onNext: () -> Unit,
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        IconButton(onClick = onPrev, enabled = canGoBack) {
            Icon(Icons.AutoMirrored.Outlined.ArrowBack, contentDescription = null)
        }
        Text(
            label,
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.SemiBold,
        )
        IconButton(onClick = onNext, enabled = canGoForward) {
            Icon(Icons.AutoMirrored.Outlined.ArrowForward, contentDescription = null)
        }
    }
}

@Composable
private fun TotalsRow(s: AnalyticsUiState) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        StatTile(
            label = stringResource(R.string.analytics_spent),
            value = Money(s.expenseTotalMinor).format(s.displayCurrency),
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.weight(1f),
        )
        StatTile(
            label = stringResource(R.string.analytics_income),
            value = Money(s.incomeTotalMinor).format(s.displayCurrency),
            color = MaterialTheme.colorScheme.secondary,
            modifier = Modifier.weight(1f),
        )
    }
    Spacer(Modifier.height(6.dp))
    val net = s.incomeTotalMinor - s.expenseTotalMinor
    val sign = if (net >= 0) "+" else "−"
    val netStr = "$sign${Money(kotlin.math.abs(net)).format(s.displayCurrency)}"
    StatTile(
        label = stringResource(R.string.analytics_net),
        value = netStr,
        color = if (net >= 0) MaterialTheme.colorScheme.secondary else MaterialTheme.colorScheme.primary,
        modifier = Modifier.fillMaxWidth(),
    )
}

@Composable
private fun StatTile(
    label: String,
    value: String,
    color: Color,
    modifier: Modifier = Modifier,
) {
    PariteCard(modifier = modifier, cornerRadius = 22.dp, shadowRadius = 12.dp) {
        Column(Modifier.padding(18.dp)) {
            Text(
                label,
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = FontWeight.Medium,
            )
            Spacer(Modifier.height(6.dp))
            Text(
                value,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.SemiBold,
                color = color,
            )
        }
    }
}

@Composable
private fun CategoryDonutCard(s: AnalyticsUiState) {
    val withCats = s.categoryTotals.mapNotNull { ct ->
        val cat = s.categories[ct.categoryId] ?: return@mapNotNull null
        cat to ct.totalMinor
    }
    val top = withCats.take(6)
    val rest = withCats.drop(6).sumOf { it.second }
    val slices = buildList {
        top.forEach { (cat, v) ->
            add(DonutSlice(value = v.toFloat(), color = parseHexOrNull(cat.colorHex) ?: Color.Gray))
        }
        if (rest > 0) add(DonutSlice(value = rest.toFloat(), color = Color(0xFF8E8E8E)))
    }

    PariteCard(modifier = Modifier.fillMaxWidth()) {
        Column(
            Modifier.padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text(
                stringResource(R.string.analytics_by_category),
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp),
            )
            Donut(
                slices = slices,
                centerLabel = stringResource(R.string.analytics_spent),
                centerValue = Money(s.expenseTotalMinor).format(s.displayCurrency),
            )
        }
    }
}

@Composable
private fun DailyBarCard(s: AnalyticsUiState) {
    PariteCard(modifier = Modifier.fillMaxWidth()) {
        Column(Modifier.padding(20.dp)) {
            Text(
                stringResource(R.string.analytics_daily),
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
            )
            Spacer(Modifier.height(12.dp))
            BarChart(
                values = s.dailyExpensesMinor.map { it.toFloat() / 100f },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp),
                barColor = MaterialTheme.colorScheme.primary,
            )
        }
    }
}

@Composable
private fun TopCategoriesCard(s: AnalyticsUiState) {
    val total = s.expenseTotalMinor.coerceAtLeast(1L)
    val rows = s.categoryTotals.take(6)

    if (rows.isEmpty()) {
        PariteCard(modifier = Modifier.fillMaxWidth()) {
            Box(Modifier.padding(28.dp), contentAlignment = Alignment.Center) {
                Text(
                    stringResource(R.string.analytics_empty),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
        return
    }

    PariteCard(modifier = Modifier.fillMaxWidth()) {
        Column(Modifier.padding(20.dp)) {
            Text(
                stringResource(R.string.analytics_top_categories),
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.padding(bottom = 12.dp),
            )
            rows.forEach { ct ->
                val cat = s.categories[ct.categoryId] ?: return@forEach
                val pct = (ct.totalMinor.toDouble() / total.toDouble() * 100).toInt()
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Surface(
                        shape = CircleShape,
                        color = (parseHexOrNull(cat.colorHex) ?: Color.Gray).copy(alpha = 0.18f),
                        modifier = Modifier.size(36.dp),
                    ) {
                        Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
                            Text(cat.emoji)
                        }
                    }
                    Spacer(Modifier.size(12.dp))
                    Column(Modifier.weight(1f)) {
                        Text(
                            cat.name,
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.Medium,
                        )
                        Text(
                            "$pct%",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    Text(
                        Money(ct.totalMinor).format(s.displayCurrency),
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                    )
                }
            }
        }
    }
}

private fun parseHexOrNull(hex: String?): Color? {
    if (hex.isNullOrBlank()) return null
    return runCatching {
        val v = hex.trimStart('#')
        Color(android.graphics.Color.parseColor("#$v"))
    }.getOrNull()
}
