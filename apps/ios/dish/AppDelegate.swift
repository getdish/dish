import UIKit
import GoogleMaps
import GooglePlaces
import XCGLogger

// GLOBALS

let log = XCGLogger.default
let homeViewState = HomeViewState()
let ANIMATION_SPEED: Double = 1

// small async helper
// todo - cancel
func async(
    _ delay: Double = 0,
    interval: Double = 0,
    queue: DispatchQueue = DispatchQueue.main,
    execute: @escaping () -> Void
) {
    var run = execute
    if interval > 0 {
        run = {
            Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { timer in
                execute()
            }
        }
    }
    if delay > 0 {
        queue.asyncAfter(deadline: .now() + .milliseconds(Int(delay))) { run() }
    } else {
        queue.async { run() }
    }
}

fileprivate func startDebugLoop() {
    #if DEBUG
    Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { timer in
        App
        homeViewState
        // set breakpoint here or we can have a shortcut in app to trigger debugger
        if App.enterRepl == true {
            raise(SIGINT)
            App.enterRepl = false
        }
    }
    #endif
}

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // one time setup

        startDebugLoop()

        // SwiftUI bugfix list/navigation backgrounds transparent
        let colorTransparent = UIColor.init(displayP3Red: 0, green: 0, blue: 0, alpha: 0)
        UITableView.appearance().backgroundColor = colorTransparent
        UITableViewCell.appearance().backgroundColor = colorTransparent

        // setup XGCLogger
        log.setup(
            level: .debug,
            showThreadName: true,
            showLevel: true,
            showFileNames: true,
            showLineNumbers: true,
            writeToFile: "path/to/file",
            fileLevel: .debug
        )

        // Google Maps and Places
        GMSServices.provideAPIKey("AIzaSyDhZI9uJRMpdDD96ITk38_AhRwyfCEEI9k")
        GMSPlacesClient.provideAPIKey("AIzaSyDhZI9uJRMpdDD96ITk38_AhRwyfCEEI9k")

        App.start()

        // Override point for customization after application launch.
        return true
    }

    // MARK: UISceneSession Lifecycle

    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        // Called when a new scene session is being created.
        // Use this method to select a configuration to create the new scene with.
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {
        // Called when the user discards a scene session.
        // If any sessions were discarded while the application was not running, this will be called shortly after application:didFinishLaunchingWithOptions.
        // Use this method to release any resources that were specific to the discarded scenes, as they will not return.
    }


}

