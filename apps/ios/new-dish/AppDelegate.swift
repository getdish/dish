//
//  AppDelegate.swift
//  new-dish
//
//  Created by Majid Jabrayilov on 12/5/19.
//  Copyright © 2019 Majid Jabrayilov. All rights reserved.
//

import UIKit
import GoogleMaps
import GooglePlaces
import XCGLogger

// Init state
let log = XCGLogger.default
let googlePlaces = GooglePlaces()
let appStore = Store<AppState, AppAction>.init(initialState: AppState(), reducer: appReducer)
let keyboard = Keyboard()
let inputEvents = InputEvents()
let q = DispatchQueue(label: "defaultQueue")

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    func startDebugLoop() {
        Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { timer in
            // set breakpoint here or we can have a shortcut in app to trigger debugger
        }
    }

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // one time setup
        
        startDebugLoop()
        
        // SwiftUI bugfix list backgrounds transparent
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
        
        // initial state
//        appStore.send(.home(.setSearch("Pho")))
        
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

