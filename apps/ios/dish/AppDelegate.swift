import UIKit
import GoogleMaps
import GooglePlaces
import XCGLogger

// GLOBALS
// most if not all should go onto here:
let App = AppModel()

// ... globals i cant seem to put on App.
// state
let homeViewState = HomeViewState()
let log = XCGLogger.default

// TODO why cant i put this on App:
let features: [DishItem] = loadJSON("dishData.json")
let restaurants: [RestaurantItem] = loadJSON("restaurantData.json")
// fixtures, mocks
// TODO why cant i call this direct
let mocks = Mocks()

// apollo
// via https://github.com/apollographql/apollo-ios/issues/36
public typealias geometry = [String : Any?]
public typealias SearchGeometry = geometry

struct APIGeometry {
    let type: String
    let coordinates: [Double]
}

//let hasuraConfig = ProjectConfig(projectName: "projectName")

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    func startDebugLoop() {
        #if DEBUG
        Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { timer in
            // anything we want to ensure is available here
            _ = App
            _ = homeViewState
            // set breakpoint here or we can have a shortcut in app to trigger debugger
            if App.enterRepl == true {
                raise(SIGINT)
                App.enterRepl = false
            }
        }
        #endif
    }

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // one time setup

        startDebugLoop()
        
        UIApplication.shared.isStatusBarHidden = false

        // hasura
//        Hasura.initialise(config: hasuraConfig, enableLogs: true)

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

