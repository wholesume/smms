ionic build android
adb install -r smms/platforms/android/build/outputs/apk/android-debug.apk
adb shell am start -a android.intent.action.MAIN -n com.wholesum.smms/.MainActivity
