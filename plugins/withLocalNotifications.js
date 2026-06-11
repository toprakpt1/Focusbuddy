const {
  withAppBuildGradle,
  withAndroidManifest,
  withMainApplication,
  withDangerousMod,
  createRunOncePlugin,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

// ─── Kotlin Templates ────────────────────────────────────────────────────────

const KOTLIN_MODULE = `package com.focusbuddy.app

import android.Manifest
import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.PermissionAwareActivity
import com.facebook.react.modules.core.PermissionListener

class NotificationSchedulerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), PermissionListener {

    companion object {
        private const val MODULE_NAME = "NotificationScheduler"
        private const val PERMISSION_REQUEST_CODE = 1001
    }

    override fun getName(): String = MODULE_NAME

    // ── Permission ────────────────────────────────────────────────────────

    @ReactMethod
    fun checkPermission(promise: Promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            val granted = ContextCompat.checkSelfPermission(
                reactApplicationContext,
                Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED
            promise.resolve(granted)
        } else {
            // Below Android 13 notification permission is granted by default
            promise.resolve(true)
        }
    }

    @ReactMethod
    fun requestPermission(promise: Promise) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            promise.resolve(true)
            return
        }

        val activity = reactApplicationContext.currentActivity
        if (activity == null) {
            promise.resolve(false)
            return
        }

        if (ContextCompat.checkSelfPermission(
                reactApplicationContext,
                Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED
        ) {
            promise.resolve(true)
            return
        }

        if (activity is PermissionAwareActivity) {
            pendingPermissionPromise = promise
            activity.requestPermissions(
                arrayOf(Manifest.permission.POST_NOTIFICATIONS),
                PERMISSION_REQUEST_CODE,
                this
            )
        } else {
            promise.resolve(false)
        }
    }

    private var pendingPermissionPromise: Promise? = null

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ): Boolean {
        if (requestCode == PERMISSION_REQUEST_CODE) {
            val granted = grantResults.isNotEmpty() &&
                grantResults[0] == PackageManager.PERMISSION_GRANTED
            pendingPermissionPromise?.resolve(granted)
            pendingPermissionPromise = null
            return true
        }
        return false
    }

    // ── Channel ───────────────────────────────────────────────────────────

    @ReactMethod
    fun createChannel(channelId: String, channelName: String, promise: Promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                channelName,
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                enableVibration(true)
            }
            val manager = reactApplicationContext
                .getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
        promise.resolve(true)
    }

    // ── Schedule ──────────────────────────────────────────────────────────

    @ReactMethod
    fun schedule(
        id: Int,
        title: String,
        body: String,
        channelId: String,
        delayMs: Double,
        promise: Promise
    ) {
        try {
            val context = reactApplicationContext
            val intent = Intent(context, NotificationReceiver::class.java).apply {
                putExtra("notificationId", id)
                putExtra("title", title)
                putExtra("body", body)
                putExtra("channelId", channelId)
            }

            val pendingIntent = PendingIntent.getBroadcast(
                context,
                id,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val triggerTime = System.currentTimeMillis() + delayMs.toLong()

            // setAlarmClock works on all Android versions without extra permissions
            val alarmInfo = AlarmManager.AlarmClockInfo(triggerTime, pendingIntent)
            alarmManager.setAlarmClock(alarmInfo, pendingIntent)

            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SCHEDULE_ERROR", e.message)
        }
    }

    // ── Cancel ────────────────────────────────────────────────────────────

    @ReactMethod
    fun cancel(id: Int, promise: Promise) {
        try {
            val context = reactApplicationContext

            val intent = Intent(context, NotificationReceiver::class.java)
            val pendingIntent = PendingIntent.getBroadcast(
                context,
                id,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            alarmManager.cancel(pendingIntent)

            NotificationManagerCompat.from(context).cancel(id)

            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("CANCEL_ERROR", e.message)
        }
    }

    @ReactMethod
    fun cancelAll(promise: Promise) {
        try {
            NotificationManagerCompat.from(reactApplicationContext).cancelAll()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("CANCEL_ALL_ERROR", e.message)
        }
    }
}
`;

const KOTLIN_RECEIVER = `package com.focusbuddy.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat

class NotificationReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val notificationId = intent.getIntExtra("notificationId", 0)
        val title = intent.getStringExtra("title") ?: "FocusBuddy"
        val body = intent.getStringExtra("body") ?: ""
        val channelId = intent.getStringExtra("channelId") ?: "default"

        // Ensure channel exists (required on Android O+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "General",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }

        val notification = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .build()

        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(notificationId, notification)
    }
}
`;

const KOTLIN_PACKAGE = `package com.focusbuddy.app

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class NotificationSchedulerPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(NotificationSchedulerModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
`;

// ─── Permissions to strip from AndroidManifest.xml ───────────────────────────

const PERMISSIONS_TO_REMOVE = [
  "android.permission.INTERNET",
  "android.permission.READ_EXTERNAL_STORAGE",
  "android.permission.WRITE_EXTERNAL_STORAGE",
  "android.permission.SYSTEM_ALERT_WINDOW",
  "android.permission.RECORD_AUDIO",
  "android.permission.ACCESS_NETWORK_STATE",
];

// ─── Plugin ──────────────────────────────────────────────────────────────────

function withLocalNotifications(config) {
  // 1) Remove expo-notifications from the plugins list
  if (config.plugins) {
    config.plugins = config.plugins.filter((plugin) => {
      const name = Array.isArray(plugin) ? plugin[0] : plugin;
      return name !== "expo-notifications";
    });
  }

  // 2) Write Kotlin source files during prebuild
  config = withDangerousMod(config, [
    "android",
    (cfg) => {
      const javaDir = path.join(
        cfg.modRequest.platformProjectRoot,
        "app/src/main/java/com/focusbuddy/app"
      );
      fs.mkdirSync(javaDir, { recursive: true });
      fs.writeFileSync(
        path.join(javaDir, "NotificationSchedulerModule.kt"),
        KOTLIN_MODULE,
        "utf8"
      );
      fs.writeFileSync(
        path.join(javaDir, "NotificationReceiver.kt"),
        KOTLIN_RECEIVER,
        "utf8"
      );
      fs.writeFileSync(
        path.join(javaDir, "NotificationSchedulerPackage.kt"),
        KOTLIN_PACKAGE,
        "utf8"
      );
      return cfg;
    },
  ]);

  // 3) Register the native module in MainApplication.kt
  config = withMainApplication(config, (cfg) => {
    let contents = cfg.modResults.contents;
    if (!contents.includes("NotificationSchedulerPackage")) {
      contents = contents.replace(
        "// add(MyReactNativePackage())",
        "add(NotificationSchedulerPackage())"
      );
      cfg.modResults.contents = contents;
    }
    return cfg;
  });

  // 4) Clean up AndroidManifest.xml
  config = withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;

    // Remove unwanted permissions
    if (manifest["uses-permission"]) {
      manifest["uses-permission"] = manifest["uses-permission"].filter((p) => {
        const name = p.$ && p.$["android:name"];
        return name && !PERMISSIONS_TO_REMOVE.includes(name);
      });
    }

    // Ensure uses-permission array exists
    if (!manifest["uses-permission"]) {
      manifest["uses-permission"] = [];
    }

    // Add POST_NOTIFICATIONS (Android 13+)
    const hasPostNotifications = manifest["uses-permission"].some(
      (p) => p.$ && p.$["android:name"] === "android.permission.POST_NOTIFICATIONS"
    );
    if (!hasPostNotifications) {
      manifest["uses-permission"].push({
        $: { "android:name": "android.permission.POST_NOTIFICATIONS" },
      });
    }

    // Register the BroadcastReceiver
    const app = manifest.application && manifest.application[0];
    if (app) {
      if (!app.receiver) {
        app.receiver = [];
      }
      const hasReceiver = app.receiver.some(
        (r) => r.$ && r.$["android:name"] === ".NotificationReceiver"
      );
      if (!hasReceiver) {
        app.receiver.push({
          $: {
            "android:name": ".NotificationReceiver",
            "android:exported": "false",
          },
        });
      }
    }

    return cfg;
  });

  // 5) Exclude Firebase from the Gradle build
  config = withAppBuildGradle(config, (cfg) => {
    if (!cfg.modResults.contents.includes("exclude group")) {
      const block = `configurations.all {
    exclude group: 'com.google.firebase', module: 'firebase-messaging'
}

`;
      cfg.modResults.contents = cfg.modResults.contents.replace(
        "dependencies {",
        block + "dependencies {"
      );
    }
    return cfg;
  });

  return config;
}

module.exports = createRunOncePlugin(
  withLocalNotifications,
  "with-local-notifications"
);
