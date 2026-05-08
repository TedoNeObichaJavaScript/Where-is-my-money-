package bg.parite.app.ui.screens.add

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items as gridItems
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Backspace
import androidx.compose.material.icons.outlined.CalendarMonth
import androidx.compose.material.icons.outlined.DeleteOutline
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import bg.parite.app.R
import bg.parite.app.data.model.Account
import bg.parite.app.data.model.Category
import bg.parite.app.data.model.Money
import bg.parite.app.data.model.TxnType
import bg.parite.app.ui.components.PariteCard
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddTransactionScreen(
    viewModel: AddTransactionViewModel,
    onDone: () -> Unit,
    onCancel: () -> Unit,
) {
    val s by viewModel.state.collectAsState()
    val titleRes = if (s.isEditing) {
        if (s.type == TxnType.EXPENSE) R.string.edit_title_expense else R.string.edit_title_income
    } else {
        if (s.type == TxnType.EXPENSE) R.string.add_title_expense else R.string.add_title_income
    }
    val account = s.accounts.firstOrNull { it.id == s.selectedAccountId }
    val currency = account?.currency ?: "EUR"

    var showDatePicker by remember { mutableStateOf(false) }
    var showCustomCategory by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        stringResource(titleRes),
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.SemiBold,
                    )
                },
                actions = {
                    if (s.isEditing) {
                        IconButton(onClick = { viewModel.delete(onDone) }) {
                            Icon(
                                Icons.Outlined.DeleteOutline,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.primary,
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background,
                ),
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            TypeSwitcher(s.type, onChange = viewModel::setType)

            DatePill(
                occurredAt = s.occurredAt,
                onClick = { showDatePicker = true },
            )

            AmountDisplay(
                state = s,
                currency = currency,
                onBackspace = viewModel::backspace,
            )

            if (s.accounts.size > 1) {
                AccountChips(
                    accounts = s.accounts,
                    selectedId = s.selectedAccountId,
                    onSelect = viewModel::setAccount,
                )
            }

            val topCats = remember(s.topCategoryIds, s.categories) {
                val byId = s.categories.associateBy { it.id }
                s.topCategoryIds.mapNotNull { byId[it] }
            }
            if (topCats.isNotEmpty()) {
                FavoritesRow(
                    categories = topCats,
                    selectedId = s.selectedCategoryId,
                    onSelect = viewModel::setCategory,
                )
            }

            CategoryGrid(
                categories = s.categories,
                selectedId = s.selectedCategoryId,
                onSelect = viewModel::setCategory,
                onAddCustom = { showCustomCategory = true },
                modifier = Modifier.weight(1f, fill = false),
            )

            OutlinedTextField(
                value = s.note,
                onValueChange = viewModel::setNote,
                placeholder = { Text(stringResource(R.string.add_note)) },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
            )

            CalculatorKeypad(
                onDigit = viewModel::appendDigit,
                onOp = viewModel::pressOp,
                onEquals = viewModel::pressEquals,
            )

            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Button(
                    onClick = onCancel,
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.surfaceContainerHigh,
                        contentColor = MaterialTheme.colorScheme.onSurface,
                    ),
                    shape = RoundedCornerShape(20.dp),
                ) { Text(stringResource(R.string.add_cancel)) }
                Button(
                    onClick = { viewModel.save(onDone) },
                    enabled = viewModel.canSave(),
                    modifier = Modifier
                        .weight(2f)
                        .height(54.dp),
                    shape = RoundedCornerShape(20.dp),
                ) {
                    Text(
                        stringResource(R.string.add_save),
                        fontWeight = FontWeight.SemiBold,
                    )
                }
            }
        }
    }

    if (showDatePicker) {
        val dateState = rememberDatePickerState(initialSelectedDateMillis = s.occurredAt)
        DatePickerDialog(
            onDismissRequest = { showDatePicker = false },
            confirmButton = {
                TextButton(onClick = {
                    dateState.selectedDateMillis?.let { viewModel.setOccurredAt(preserveTimeOfDay(s.occurredAt, it)) }
                    showDatePicker = false
                }) { Text(stringResource(R.string.add_save)) }
            },
            dismissButton = {
                TextButton(onClick = { showDatePicker = false }) {
                    Text(stringResource(R.string.add_cancel))
                }
            },
        ) { DatePicker(state = dateState) }
    }

    if (showCustomCategory) {
        CustomCategoryDialog(
            onDismiss = { showCustomCategory = false },
            onCreate = { name, emoji, color ->
                viewModel.addCustomCategory(name, emoji, color)
                showCustomCategory = false
            },
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun TypeSwitcher(type: TxnType, onChange: (TxnType) -> Unit) {
    SingleChoiceSegmentedButtonRow(modifier = Modifier.fillMaxWidth()) {
        SegmentedButton(
            selected = type == TxnType.EXPENSE,
            onClick = { onChange(TxnType.EXPENSE) },
            shape = SegmentedButtonDefaults.itemShape(0, 2),
        ) { Text(stringResource(R.string.add_expense)) }
        SegmentedButton(
            selected = type == TxnType.INCOME,
            onClick = { onChange(TxnType.INCOME) },
            shape = SegmentedButtonDefaults.itemShape(1, 2),
        ) { Text(stringResource(R.string.add_income)) }
    }
}

@Composable
private fun DatePill(occurredAt: Long, onClick: () -> Unit) {
    val ctx = LocalContext.current
    val label = remember(occurredAt) { formatDate(ctx, occurredAt) }
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(50),
        color = MaterialTheme.colorScheme.surfaceContainer,
        modifier = Modifier.padding(vertical = 2.dp),
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Icon(
                Icons.Outlined.CalendarMonth,
                contentDescription = null,
                modifier = Modifier.size(18.dp),
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Text(label, style = MaterialTheme.typography.labelLarge)
        }
    }
}

@Composable
private fun AmountDisplay(
    state: AddUiState,
    currency: String,
    onBackspace: () -> Unit,
) {
    val previewMoney = Money.fromString(state.display, currency)
    val mainText = previewMoney?.format(currency) ?: Money(0).format(currency)
    val expression = buildExpressionLabel(state)

    PariteCard(modifier = Modifier.fillMaxWidth()) {
        Column(
            Modifier.padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            if (expression != null) {
                Text(
                    expression,
                    style = MaterialTheme.typography.labelLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Spacer(Modifier.height(2.dp))
            }
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Text(
                    mainText,
                    fontSize = 44.sp,
                    fontWeight = FontWeight.SemiBold,
                    letterSpacing = (-0.5).sp,
                )
                if (state.display.isNotEmpty()) {
                    Surface(
                        onClick = onBackspace,
                        shape = CircleShape,
                        color = MaterialTheme.colorScheme.surfaceContainerHigh,
                        modifier = Modifier.size(36.dp),
                    ) {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier.fillMaxSize(),
                        ) {
                            Icon(
                                Icons.AutoMirrored.Filled.Backspace,
                                contentDescription = null,
                                modifier = Modifier.size(18.dp),
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun AccountChips(
    accounts: List<Account>,
    selectedId: Long?,
    onSelect: (Long) -> Unit,
) {
    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        items(accounts, key = { it.id }) { acc ->
            FilterChip(
                selected = acc.id == selectedId,
                onClick = { onSelect(acc.id) },
                label = { Text("${acc.emoji} ${acc.name}") },
                colors = FilterChipDefaults.filterChipColors(),
            )
        }
    }
}

@Composable
private fun FavoritesRow(
    categories: List<Category>,
    selectedId: Long?,
    onSelect: (Long) -> Unit,
) {
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Text(
            stringResource(R.string.add_recent),
            style = MaterialTheme.typography.labelMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            fontWeight = FontWeight.Medium,
            modifier = Modifier.padding(start = 4.dp),
        )
        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            items(categories, key = { it.id }) { cat ->
                val accent = parseHexOrNull(cat.colorHex) ?: MaterialTheme.colorScheme.primary
                val selected = cat.id == selectedId
                FilterChip(
                    selected = selected,
                    onClick = { onSelect(cat.id) },
                    label = { Text("${cat.emoji} ${cat.name}", fontWeight = FontWeight.Medium) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = accent.copy(alpha = 0.18f),
                        selectedLabelColor = MaterialTheme.colorScheme.onSurface,
                    ),
                )
            }
        }
    }
}

@Composable
private fun CategoryGrid(
    categories: List<Category>,
    selectedId: Long?,
    onSelect: (Long) -> Unit,
    onAddCustom: () -> Unit,
    modifier: Modifier = Modifier,
) {
    LazyVerticalGrid(
        columns = GridCells.Fixed(4),
        contentPadding = PaddingValues(vertical = 4.dp),
        horizontalArrangement = Arrangement.spacedBy(10.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
        modifier = modifier.fillMaxWidth(),
    ) {
        gridItems(categories, key = { it.id }) { cat ->
            CategoryTile(cat, selected = cat.id == selectedId, onClick = { onSelect(cat.id) })
        }
        gridItems(items = listOf(0)) {
            AddCategoryTile(onClick = onAddCustom)
        }
    }
}

@Composable
private fun CategoryTile(
    category: Category,
    selected: Boolean,
    onClick: () -> Unit,
) {
    val scale by animateFloatAsState(if (selected) 1.04f else 1f, label = "tile-scale")
    val accent = parseHexOrNull(category.colorHex) ?: MaterialTheme.colorScheme.primary
    val container = if (selected) accent.copy(alpha = 0.18f)
    else MaterialTheme.colorScheme.surfaceContainer
    val border = if (selected) BorderStroke(2.dp, accent) else null

    Surface(
        shape = RoundedCornerShape(18.dp),
        color = container,
        border = border,
        onClick = onClick,
        modifier = Modifier
            .fillMaxWidth()
            .height(76.dp),
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(vertical = 10.dp, horizontal = 6.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            Text(category.emoji, fontSize = (22 * scale).sp)
            Spacer(Modifier.height(4.dp))
            Text(
                category.name,
                style = MaterialTheme.typography.labelMedium,
                maxLines = 1,
            )
        }
    }
}

@Composable
private fun AddCategoryTile(onClick: () -> Unit) {
    Surface(
        shape = RoundedCornerShape(18.dp),
        color = MaterialTheme.colorScheme.surfaceContainer.copy(alpha = 0.5f),
        border = BorderStroke(
            1.5.dp,
            MaterialTheme.colorScheme.outlineVariant,
        ),
        onClick = onClick,
        modifier = Modifier
            .fillMaxWidth()
            .height(76.dp),
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            Text("＋", fontSize = 22.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(Modifier.height(2.dp))
            Text(
                stringResource(R.string.add_custom_cat_short),
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 1,
            )
        }
    }
}

@Composable
private fun CalculatorKeypad(
    onDigit: (Char) -> Unit,
    onOp: (Op) -> Unit,
    onEquals: () -> Unit,
) {
    val rows = listOf(
        listOf(KeypadKey.D('7'), KeypadKey.D('8'), KeypadKey.D('9'), KeypadKey.OpKey(Op.DIV)),
        listOf(KeypadKey.D('4'), KeypadKey.D('5'), KeypadKey.D('6'), KeypadKey.OpKey(Op.MUL)),
        listOf(KeypadKey.D('1'), KeypadKey.D('2'), KeypadKey.D('3'), KeypadKey.OpKey(Op.SUB)),
        listOf(KeypadKey.D('.'), KeypadKey.D('0'), KeypadKey.Equals, KeypadKey.OpKey(Op.ADD)),
    )
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        rows.forEach { row ->
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                row.forEach { k ->
                    KeyButton(
                        key = k,
                        modifier = Modifier.weight(1f),
                        onClick = {
                            when (k) {
                                is KeypadKey.D -> onDigit(k.c)
                                is KeypadKey.OpKey -> onOp(k.op)
                                KeypadKey.Equals -> onEquals()
                            }
                        },
                    )
                }
            }
        }
    }
}

private sealed interface KeypadKey {
    data class D(val c: Char) : KeypadKey
    data class OpKey(val op: Op) : KeypadKey
    data object Equals : KeypadKey
}

@Composable
private fun KeyButton(key: KeypadKey, modifier: Modifier = Modifier, onClick: () -> Unit) {
    val (label, color, content) = when (key) {
        is KeypadKey.D -> Triple(
            key.c.toString(),
            MaterialTheme.colorScheme.surfaceContainer,
            MaterialTheme.colorScheme.onSurface,
        )
        is KeypadKey.OpKey -> Triple(
            key.op.symbol,
            MaterialTheme.colorScheme.surfaceContainerHigh,
            MaterialTheme.colorScheme.primary,
        )
        KeypadKey.Equals -> Triple(
            "=",
            MaterialTheme.colorScheme.primary,
            MaterialTheme.colorScheme.onPrimary,
        )
    }
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = color,
        contentColor = content,
        onClick = onClick,
        modifier = modifier.height(52.dp),
    ) {
        Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
            Text(label, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Medium)
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun CustomCategoryDialog(
    onDismiss: () -> Unit,
    onCreate: (name: String, emoji: String, colorHex: String) -> Unit,
) {
    val swatches = listOf(
        "#E07A5F", "#7BA98C", "#5B8DBE", "#9B7BB8",
        "#D4A24C", "#D8758F", "#6BA9A9", "#C58B5C",
    )
    var name by remember { mutableStateOf("") }
    var emoji by remember { mutableStateOf("🏷️") }
    var color by remember { mutableStateOf(swatches.first()) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(stringResource(R.string.custom_cat_title)) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    OutlinedTextField(
                        value = emoji,
                        onValueChange = { emoji = it.take(4) },
                        label = { Text(stringResource(R.string.custom_cat_emoji)) },
                        singleLine = true,
                        modifier = Modifier.width(96.dp),
                    )
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it.take(24) },
                        label = { Text(stringResource(R.string.custom_cat_name)) },
                        singleLine = true,
                        modifier = Modifier.weight(1f),
                    )
                }
                Text(
                    stringResource(R.string.custom_cat_color),
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    swatches.forEach { hex ->
                        val swColor = parseHexOrNull(hex) ?: Color.Gray
                        val selected = hex == color
                        Box(
                            modifier = Modifier
                                .size(34.dp)
                                .background(swColor, CircleShape)
                                .border(
                                    width = if (selected) 3.dp else 0.dp,
                                    color = MaterialTheme.colorScheme.onBackground,
                                    shape = CircleShape,
                                )
                                .clickable { color = hex }
                        )
                    }
                }
            }
        },
        confirmButton = {
            TextButton(
                onClick = { onCreate(name, emoji, color) },
                enabled = name.isNotBlank(),
            ) { Text(stringResource(R.string.custom_cat_create)) }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text(stringResource(R.string.add_cancel)) }
        },
    )
}

private fun parseHexOrNull(hex: String?): Color? {
    if (hex.isNullOrBlank()) return null
    return runCatching {
        val v = hex.trimStart('#')
        Color(android.graphics.Color.parseColor("#$v"))
    }.getOrNull()
}

private fun buildExpressionLabel(state: AddUiState): String? {
    val acc = state.accumulator ?: return null
    val op = state.pendingOp ?: return null
    return "${acc.stripTrailingZeros().toPlainString().removeSuffix(".")}  ${op.symbol}"
}

private fun formatDate(context: android.content.Context, millis: Long): String {
    val cal = Calendar.getInstance().apply { timeInMillis = millis }
    val today = Calendar.getInstance().apply {
        set(Calendar.HOUR_OF_DAY, 0); set(Calendar.MINUTE, 0)
        set(Calendar.SECOND, 0); set(Calendar.MILLISECOND, 0)
    }
    val yesterday = (today.clone() as Calendar).apply { add(Calendar.DAY_OF_MONTH, -1) }
    val day = (cal.clone() as Calendar).apply {
        set(Calendar.HOUR_OF_DAY, 0); set(Calendar.MINUTE, 0)
        set(Calendar.SECOND, 0); set(Calendar.MILLISECOND, 0)
    }
    return when (day.timeInMillis) {
        today.timeInMillis -> context.getString(R.string.day_today)
        yesterday.timeInMillis -> context.getString(R.string.day_yesterday)
        else -> {
            val sdf = if (cal.get(Calendar.YEAR) == today.get(Calendar.YEAR))
                SimpleDateFormat("EEE, MMM d", Locale.getDefault())
            else
                SimpleDateFormat("MMM d, yyyy", Locale.getDefault())
            sdf.format(Date(millis))
        }
    }
}

private fun preserveTimeOfDay(originalMillis: Long, newDateMillis: Long): Long {
    val original = Calendar.getInstance().apply { timeInMillis = originalMillis }
    val target = Calendar.getInstance().apply { timeInMillis = newDateMillis }
    target.set(Calendar.HOUR_OF_DAY, original.get(Calendar.HOUR_OF_DAY))
    target.set(Calendar.MINUTE, original.get(Calendar.MINUTE))
    target.set(Calendar.SECOND, original.get(Calendar.SECOND))
    target.set(Calendar.MILLISECOND, original.get(Calendar.MILLISECOND))
    return target.timeInMillis
}
