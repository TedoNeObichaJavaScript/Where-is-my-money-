# Build & deploy

## One-time setup (Windows)

- Android Studio installed (provides SDK at `C:\Users\<you>\AppData\Local\Android\Sdk`).
- JDK 17+ (we test with JDK 21 at `C:\Program Files\Java\jdk-21`).
- The `gradle-wrapper.jar` is committed; first run downloads Gradle 8.10.2 itself (~150 MB, one-time).
- `local.properties` points at the SDK. If you cloned fresh, create it:

  ```properties
  sdk.dir=C\:\\Users\\<you>\\AppData\\Local\\Android\\Sdk
  ```

## Build & install on running emulator

From Git Bash:

```bash
ANDROID_HOME="C:\\Users\\<you>\\AppData\\Local\\Android\\Sdk" \
  ./gradlew.bat installDebug --console=plain --no-daemon
```

Cold first build: 3–4 minutes. Subsequent: ~30 seconds.

## Launch

```bash
adb -s emulator-5554 shell am force-stop bg.parite.app.debug
adb -s emulator-5554 shell am start -n bg.parite.app.debug/bg.parite.app.MainActivity
```

`force-stop` first — otherwise you'll see stale state from the previous process.

## Why `.debug` suffix

`app/build.gradle.kts` sets `applicationIdSuffix = ".debug"` on the debug build type, so debug + release can be installed side-by-side.

## Screenshot

```bash
adb -s emulator-5554 exec-out screencap -p > screen.png
```

## Common pitfalls

- **Empty Home on cold launch** is not a bug. Room flows take ~500 ms to emit; the screenshot you took in the first second will show defaults. Wait 2–3 s.
- **Biometric toggle disabled** on the AVD is correct — no fingerprint enrolled. Will light up on a real Pixel with biometrics set up.
- **`@RequiresApi` on framework-called overrides is a Lint trap.** Don't add it to `TileService.onClick`, `AppWidgetProvider`, `BroadcastReceiver`. Gate inside with `Build.VERSION.SDK_INT`.
- **Before bumping AGP / Kotlin / Compose**: bump them in `gradle/libs.versions.toml` only — never inline in module Gradle files.
