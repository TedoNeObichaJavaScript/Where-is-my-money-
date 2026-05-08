package bg.parite.app.ui.screens.home

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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExtendedFloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.rememberTopAppBarState
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import bg.parite.app.R
import bg.parite.app.data.model.Account
import bg.parite.app.data.model.Category
import bg.parite.app.data.model.Money
import bg.parite.app.data.model.Transaction
import bg.parite.app.data.model.TxnType
import bg.parite.app.ui.components.PariteCard
import bg.parite.app.ui.components.PariteLargeTopBar

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: HomeViewModel,
    onAdd: () -> Unit,
) {
    val s by viewModel.state.collectAsState()
    val scrollBehavior = TopAppBarDefaults.exitUntilCollapsedScrollBehavior(rememberTopAppBarState())

    Scaffold(
        modifier = Modifier.nestedScroll(scrollBehavior.nestedScrollConnection),
        topBar = {
            PariteLargeTopBar(
                title = stringResource(R.string.app_name_short),
                scrollBehavior = scrollBehavior,
            )
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = onAdd,
                icon = { Icon(Icons.Default.Add, contentDescription = null) },
                text = { Text(stringResource(R.string.nav_add), fontWeight = FontWeight.SemiBold) },
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = MaterialTheme.colorScheme.onPrimary,
            )
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
                bottom = padding.calculateBottomPadding() + 96.dp,
            ),
            verticalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            item { TotalsCard(s) }
            item { TodayMonthRow(s) }
            item {
                Text(
                    stringResource(R.string.home_recent),
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.padding(top = 8.dp, start = 4.dp),
                )
            }
            if (s.recent.isEmpty()) {
                item { EmptyState() }
            } else {
                items(s.recent, key = { it.id }) { txn ->
                    val cat = s.categories.firstOrNull { it.id == txn.categoryId }
                    val acc = s.accounts.firstOrNull { it.id == txn.accountId }
                    TransactionRow(txn, cat, acc)
                }
            }
        }
    }
}

@Composable
private fun TotalsCard(s: HomeUiState) {
    val totalMinor = s.balances
        .filter { it.currency == s.displayCurrency }
        .sumOf { it.balanceMinor }

    PariteCard(
        modifier = Modifier.fillMaxWidth(),
        cornerRadius = 28.dp,
        container = MaterialTheme.colorScheme.secondaryContainer,
        shadowRadius = 18.dp,
    ) {
        Column(Modifier.padding(28.dp)) {
            Text(
                stringResource(R.string.home_balance_total),
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.onSecondaryContainer.copy(alpha = 0.75f),
                fontWeight = FontWeight.Medium,
            )
            Spacer(Modifier.height(6.dp))
            Text(
                Money(totalMinor).format(s.displayCurrency),
                fontSize = 44.sp,
                fontWeight = FontWeight.SemiBold,
                letterSpacing = (-0.8).sp,
                color = MaterialTheme.colorScheme.onSecondaryContainer,
            )
        }
    }
}

@Composable
private fun TodayMonthRow(s: HomeUiState) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        SmallStatCard(
            label = stringResource(R.string.home_today_spent),
            value = Money(s.todaySpentMinor).format(s.displayCurrency),
            modifier = Modifier.weight(1f),
        )
        SmallStatCard(
            label = stringResource(R.string.home_this_month),
            value = Money(s.monthSpentMinor).format(s.displayCurrency),
            modifier = Modifier.weight(1f),
        )
    }
}

@Composable
private fun SmallStatCard(label: String, value: String, modifier: Modifier = Modifier) {
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
            )
        }
    }
}

@Composable
private fun EmptyState() {
    PariteCard(modifier = Modifier.fillMaxWidth()) {
        Box(Modifier.padding(28.dp), contentAlignment = Alignment.Center) {
            Text(
                stringResource(R.string.home_no_transactions),
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}

@Composable
private fun TransactionRow(txn: Transaction, cat: Category?, acc: Account?) {
    PariteCard(modifier = Modifier.fillMaxWidth(), cornerRadius = 20.dp, shadowRadius = 10.dp) {
        Row(
            Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            CategoryBadge(emoji = cat?.emoji ?: "•", colorHex = cat?.colorHex)
            Spacer(Modifier.size(12.dp))
            Column(Modifier.weight(1f)) {
                Text(
                    cat?.name ?: "—",
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Medium,
                )
                val meta = buildString {
                    if (!txn.note.isNullOrBlank()) append(txn.note)
                    if (acc != null) {
                        if (isNotEmpty()) append("  ·  ")
                        append("${acc.emoji} ${acc.name}")
                    }
                }
                if (meta.isNotEmpty()) {
                    Text(
                        meta,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
            val sign = if (txn.type == TxnType.INCOME) "+" else "−"
            val color = if (txn.type == TxnType.INCOME)
                MaterialTheme.colorScheme.secondary else MaterialTheme.colorScheme.primary
            Text(
                "$sign${Money(txn.amountMinor).format(txn.currency)}",
                style = MaterialTheme.typography.titleMedium,
                color = color,
                fontWeight = FontWeight.SemiBold,
            )
        }
    }
}

@Composable
private fun CategoryBadge(emoji: String, colorHex: String?) {
    val bg = parseHexOrNull(colorHex) ?: MaterialTheme.colorScheme.surfaceContainerHigh
    Surface(
        shape = CircleShape,
        color = bg.copy(alpha = 0.18f),
        modifier = Modifier.size(40.dp),
    ) {
        Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
            Text(emoji, style = MaterialTheme.typography.titleMedium)
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
