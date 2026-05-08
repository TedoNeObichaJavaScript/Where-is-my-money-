package bg.parite.app.ui.nav

import bg.parite.app.data.model.TxnType

object Routes {
    const val HOME = "home"
    const val ADD = "add"
    const val ADD_TYPED = "add/quick/{type}"
    const val EDIT = "add/edit/{id}"
    const val HISTORY = "history"
    const val ANALYTICS = "analytics"
    const val SETTINGS = "settings"

    fun editRoute(id: Long): String = "add/edit/$id"
    fun addTypedRoute(type: TxnType): String = "add/quick/${type.name.lowercase()}"
}

sealed interface LaunchTarget {
    data class AddTyped(val type: TxnType, val ts: Long) : LaunchTarget
}
