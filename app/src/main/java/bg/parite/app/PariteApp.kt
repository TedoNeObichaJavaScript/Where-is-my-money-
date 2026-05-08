package bg.parite.app

import android.app.Application
import bg.parite.app.di.AppContainer

class PariteApp : Application() {

    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        container = AppContainer(applicationContext)
    }
}
