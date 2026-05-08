package bg.parite.app.ui.screens.history

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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Snackbar
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.SnackbarResult
import androidx.compose.material3.Surface
import androidx.compose.material3.SwipeToDismissBox
import androidx.compose.material3.SwipeToDismissBoxValue
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.rememberSwipeToDismissBoxState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import bg.parite.app.R
import bg.parite.app.data.model.Account
import bg.parite.app.data.model.Category
import bg.parite.app.data.model.Money
import bg.parite.app.data.model.Transaction
import bg.parite.app.data.model.TxnType
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HistoryScreen(
    viewModel: HistoryViewModel,
    onEdit: (Long) -> Unit = {},
) {
    val state by viewModel.state.collectAsState()
    val snackbar = remember { SnackbarHostState() }
    val undoLabel = stringResource(R.string.history_undo)

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(stringResource(R.string.history_title)) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background,
                ),
            )
        },
        snackbarHost = {
            SnackbarHost(snackbar) { data ->
                Snackbar(
                    snackbarData = data,
                    shape = RoundedCornerShape(16.dp),
                )
            }
        },
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(padding),
        ) {
            OutlinedTextField(
                value = state.query,
                onValueChange = viewModel::setQuery,
                placeholder = { Text(stringResource(R.string.history_search_hint)) },
                leadingIcon = { Icon(Icons.Outlined.Search, contentDescription = null) },
                singleLine = true,
                shape = RoundedCornerShape(18.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
            )

            if (state.transactions.isEmpty()) {
                EmptyHistory()
            } else {
                val groups = remember(state.transactions) { groupByDay(state.transactions) }
                LazyColumn(
                    contentPadding = PaddingValues(
                        start = 16.dp, end = 16.dp,
                        bottom = padding.calculateBottomPadding() + 24.dp,
                    ),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    groups.forEach { (header, items) ->
                        item(key = "h-$header") {
                            val label = when (header) {
                                DAY_TODAY -> stringResource(R.string.day_today)
                                DAY_YESTERDAY -> stringResource(R.string.day_yesterday)
                                else -> header
                            }
                            Text(
                                label,
                                style = MaterialTheme.typography.labelLarge,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                fontWeight = FontWeight.Medium,
                                modifier = Modifier.padding(top = 12.dp, bottom = 4.dp, start = 4.dp),
                            )
                        }
                        items.forEach { txn ->
                            item(key = "t-${txn.id}") {
                                SwipeRow(
                                    txn = txn,
                                    cat = state.categories[txn.categoryId],
                                    acc = state.accounts[txn.accountId],
                                    onClick = { onEdit(txn.id) },
                                    onDelete = {
                                        viewModel.delete(txn)
                                        snackbar.showAndAwait(
                                            message = "Deleted",
                                            actionLabel = undoLabel,
                                            onUndo = { viewModel.undoLastDelete() },
                                        )
                                    },
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun EmptyHistory() {
    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text(
            stringResource(R.string.history_empty),
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun SwipeRow(
    txn: Transaction,
    cat: Category?,
    acc: Account?,
    onClick: () -> Unit,
    onDelete: suspend () -> Unit,
) {
    val state = rememberSwipeToDismissBoxState(
        confirmValueChange = { value ->
            value == SwipeToDismissBoxValue.EndToStart || value == SwipeToDismissBoxValue.StartToEnd
        }
    )
    LaunchedEffect(state.currentValue) {
        if (state.currentValue != SwipeToDismissBoxValue.Settled) {
            onDelete()
            state.reset()
        }
    }

    SwipeToDismissBox(
        state = state,
        backgroundContent = {
            Box(
                Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp),
                contentAlignment = Alignment.CenterEnd,
            ) {
                Surface(
                    color = MaterialTheme.colorScheme.errorContainer,
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Box(Modifier.padding(20.dp), contentAlignment = Alignment.CenterEnd) {
                        Text(
                            stringResource(R.string.history_delete),
                            color = MaterialTheme.colorScheme.onErrorContainer,
                            fontWeight = FontWeight.Medium,
                        )
                    }
                }
            }
        },
    ) {
        TransactionRow(txn, cat, acc, onClick = onClick)
    }
}

@Composable
private fun TransactionRow(txn: Transaction, cat: Category?, acc: Account?, onClick: () -> Unit) {
    Card(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceContainer,
        ),
    ) {
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

private suspend fun SnackbarHostState.showAndAwait(
    message: String,
    actionLabel: String,
    onUndo: () -> Unit,
) {
    val result = showSnackbar(
        message = message,
        actionLabel = actionLabel,
        withDismissAction = false,
    )
    if (result == SnackbarResult.ActionPerformed) onUndo()
}

private fun groupByDay(txns: List<Transaction>): List<Pair<String, List<Transaction>>> {
    val sdf = SimpleDateFormat("EEE, MMM d", Locale.getDefault())
    val today = Calendar.getInstance().apply {
        set(Calendar.HOUR_OF_DAY, 0); set(Calendar.MINUTE, 0)
        set(Calendar.SECOND, 0); set(Calendar.MILLISECOND, 0)
    }
    val yesterday = (today.clone() as Calendar).apply { add(Calendar.DAY_OF_MONTH, -1) }
    val thisYear = today.get(Calendar.YEAR)
    val sdfWithYear = SimpleDateFormat("MMM d, yyyy", Locale.getDefault())

    return txns.groupBy { txn ->
        val cal = Calendar.getInstance().apply { timeInMillis = txn.occurredAt }
        cal.set(Calendar.HOUR_OF_DAY, 0); cal.set(Calendar.MINUTE, 0)
        cal.set(Calendar.SECOND, 0); cal.set(Calendar.MILLISECOND, 0)
        when (cal.timeInMillis) {
            today.timeInMillis -> DAY_TODAY
            yesterday.timeInMillis -> DAY_YESTERDAY
            else -> if (cal.get(Calendar.YEAR) == thisYear) sdf.format(Date(cal.timeInMillis))
            else sdfWithYear.format(Date(cal.timeInMillis))
        }
    }.toList()
}

private const val DAY_TODAY = "__today__"
private const val DAY_YESTERDAY = "__yesterday__"
