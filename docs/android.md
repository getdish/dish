Dependencies:
  * Android SDK, gradle, android-tools
  * Latest Java and Java 8 are needed

I, @tombh, particularly needed these because of Arch Linux and SwayWM (Wayland):
```
export ANDROID_SDK_ROOT=~/Android/Sdk/
export ANDROID_HOME=$ANDROID_SDK_ROOT
export _JAVA_AWT_WM_NONREPARENTING=1
export STUDIO_JDK=/usr/lib/jvm/java-14-openjdk
```

Accept licenses for certain Android SDK plugins:
```
yes | PATH="/usr/lib/jvm/java-8-openjdk/jre/bin/:$PATH" \
  ~/Android/Sdk/tools/bin/sdkmanager --licenses
```

Some certificate, I don't know what for:
```
keytool -genkey -v -keystore dish-app/android/app/debug.keystore \
  -storepass android -alias androiddebugkey -keypass android \
  -keyalg RSA -keysize 2048 -validity 10000
```

Basic development workflow:
```
# Build and watch app as normal (in project root)
TARGET=native yarn build:watch

# Starts react-native and debug server (in dish-app)
yarn start

# Builds the Android dev APK, opens `adb` connection (in dish-app)
yarn android
```

Dev server available at http://localhost:8081/debugger-ui/

## Current issues

React Native's `yarn start` generates this. Though doesn't seem to cause any obvious problems.
```
Error: EISDIR: illegal operation on a directory, read
    at Object.readSync (fs.js:523:3)
    at tryReadSync (fs.js:348:20)
    at Object.readFileSync (fs.js:385:19)
    at UnableToResolveError.buildCodeFrameMessage (/home/tombh/Workspace/dish/dish-app/node_modules/metro/src/node-haste/DependencyGraph/ModuleResolution.js:339:17)
    at new UnableToResolveError (/home/tombh/Workspace/dish/dish-app/node_modules/metro/src/node-haste/DependencyGraph/ModuleResolution.js:325:35)
    at ModuleResolver.resolveDependency (/home/tombh/Workspace/dish/dish-app/node_modules/metro/src/node-haste/DependencyGraph/ModuleResolution.js:203:15)
    at DependencyGraph.resolveDependency (/home/tombh/Workspace/dish/dish-app/node_modules/metro/src/node-haste/DependencyGraph.js:404:43)
    at /home/tombh/Workspace/dish/dish-app/node_modules/metro/src/lib/transformHelpers.js:301:42
    at /home/tombh/Workspace/dish/dish-app/node_modules/metro/src/Server.js:1459:14
    at Generator.next (<anonymous>)
```

`TARGET=native` doesn't seem to get passed through in `yarn build:watch`, so `SEARCH_DOMAIN`
is incorrect. Search does work when hardcoded with the correct domain.

App is generally slow on my mobile, a recent high spec Samsumg Galaxy S10

Results pages never load, no errors in logs

Most of the styling and UI is good, just some small issues
