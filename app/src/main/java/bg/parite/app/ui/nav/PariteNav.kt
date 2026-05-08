package bg.parite.app.ui.nav

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ReceiptLong
import androidx.compose.material.icons.outlined.AddCircle
import androidx.compose.material.icons.outlined.BarChart
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import bg.parite.app.R
import bg.parite.app.data.model.TxnType
import bg.parite.app.di.AppContainer
import bg.parite.app.ui.screens.add.AddTransactionScreen
import bg.parite.app.ui.screens.add.AddTransactionViewModel
import bg.parite.app.ui.screens.analytics.AnalyticsScreen
import bg.parite.app.ui.screens.analytics.AnalyticsViewModel
import bg.parite.app.ui.screens.history.HistoryScreen
import bg.parite.app.ui.screens.history.HistoryViewModel
import bg.parite.app.ui.screens.home.HomeScreen
import bg.parite.app.ui.screens.home.HomeViewModel
import bg.parite.app.ui.screens.settings.SettingsScreen
import bg.parite.app.ui.screens.settings.SettingsViewModel
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking

private data class NavItem(val route: String, val labelRes: Int, val icon: ImageVector)

private val items = listOf(
    NavItem(Routes.HOME,      R.string.nav_home,      Icons.Outlined.Home),
    NavItem(Routes.HISTORY,   R.string.nav_history,   Icons.AutoMirrored.Outlined.ReceiptLong),
    NavItem(Routes.ADD,       R.string.nav_add,       Icons.Outlined.AddCircle),
    NavItem(Routes.ANALYTICS, R.string.nav_analytics, Icons.Outlined.BarChart),
    NavItem(Routes.SETTINGS,  R.string.nav_settings,  Icons.Outlined.Settings),
)

private fun bottomBarVisible(route: String?): Boolean =
    route in items.map { it.route }

@Composable
fun PariteNav(
    container: AppContainer,
    launchTarget: StateFlow<LaunchTarget?>,
) {
    val navController = rememberNavController()
    val backStack by navController.currentBackStackEntryAsState()
    val currentRoute = backStack?.destination?.route

    val target by launchTarget.collectAsStateWithLifecycle()
    LaunchedEffect(target) {
        when (val t = target) {
            is LaunchTarget.AddTyped -> {
                navController.navigate(Routes.addTypedRoute(t.type)) {
                    launchSingleTop = true
                }
            }
            null -> Unit
        }
    }

    Scaffold(
        bottomBar = {
            if (bottomBarVisible(currentRoute)) {
                NavigationBar {
                    items.forEach { item ->
                        val selected = currentRoute == item.route ||
                            backStack?.destination?.hierarchy?.any { it.route == item.route } == true
                        NavigationBarItem(
                            selected = selected,
                            onClick = {
                                navController.navigate(item.route) {
                                    popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            },
                            icon = { Icon(item.icon, contentDescription = null) },
                            label = { Text(stringResource(item.labelRes)) },
                        )
                    }
                }
            }
        }
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = Routes.HOME,
            modifier = Modifier.padding(padding),
        ) {
            composable(Routes.HOME) {
                val vm: HomeViewModel = viewModel(factory = viewModelFactory {
                    initializer {
                        HomeViewModel(
                            container.transactionRepository,
                            container.accountRepository,
                            container.categoryRepository,
                        )
                    }
                })
                HomeScreen(
                    viewModel = vm,
                    onAdd = { navController.navigate(Routes.ADD) },
                )
            }
            composable(Routes.ADD) {
                val vm: AddTransactionViewModel = viewModel(factory = viewModelFactory {
                    initializer {
                        AddTransactionViewModel(
                            container.transactionRepository,
                            container.accountRepository,
                            container.categoryRepository,
                            editingId = null,
                            initialType = null,
                        )
                    }
                })
                AddTransactionScreen(
                    viewModel = vm,
                    onDone = { navController.popBackStack() },
                    onCancel = { navController.popBackStack() },
                )
            }
            composable(
                route = Routes.ADD_TYPED,
                arguments = listOf(navArgument("type") { type = NavType.StringType }),
            ) { entry ->
                val typeStr = entry.arguments?.getString("type") ?: "expense"
                val initialType = if (typeStr.equals("income", true)) TxnType.INCOME else TxnType.EXPENSE
                val vm: AddTransactionViewModel = viewModel(
                    key = "add-typed-${entry.id}",
                    factory = viewModelFactory {
                        initializer {
                            AddTransactionViewModel(
                                container.transactionRepository,
                                container.accountRepository,
                                container.categoryRepository,
                                editingId = null,
                                initialType = initialType,
                            )
                        }
                    },
                )
                AddTransactionScreen(
                    viewModel = vm,
                    onDone = { navController.popBackStack() },
                    onCancel = { navController.popBackStack() },
                )
            }
            composable(
                route = Routes.EDIT,
                arguments = listOf(navArgument("id") { type = NavType.LongType }),
            ) { entry ->
                val id = entry.arguments?.getLong("id") ?: return@composable
                val vm: AddTransactionViewModel = viewModel(factory = viewModelFactory {
                    initializer {
                        AddTransactionViewModel(
                            container.transactionRepository,
                            container.accountRepository,
                            container.categoryRepository,
                            editingId = id,
                            initialType = null,
                        )
                    }
                })
                AddTransactionScreen(
                    viewModel = vm,
                    onDone = { navController.popBackStack() },
                    onCancel = { navController.popBackStack() },
                )
            }
            composable(Routes.HISTORY) {
                val vm: HistoryViewModel = viewModel(factory = viewModelFactory {
                    initializer {
                        HistoryViewModel(
                            container.transactionRepository,
                            container.accountRepository,
                            container.categoryRepository,
                        )
                    }
                })
                HistoryScreen(
                    viewModel = vm,
                    onEdit = { id -> navController.navigate(Routes.editRoute(id)) },
                )
            }
            composable(Routes.ANALYTICS) {
                val vm: AnalyticsViewModel = viewModel(factory = viewModelFactory {
                    initializer {
                        AnalyticsViewModel(
                            container.transactionRepository,
                            container.categoryRepository,
                            displayCurrency = {
                                runBlocking {
                                    container.accountRepository.observeActive().first()
                                        .firstOrNull()?.currency ?: "EUR"
                                }
                            },
                        )
                    }
                })
                AnalyticsScreen(viewModel = vm)
            }
            composable(Routes.SETTINGS) {
                val vm: SettingsViewModel = viewModel(factory = viewModelFactory {
                    initializer {
                        SettingsViewModel(
                            container.settingsRepository,
                            container.backupService,
                        )
                    }
                })
                SettingsScreen(viewModel = vm)
            }
        }
    }
}
