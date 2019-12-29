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

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // SwiftUI bugfix list backgrounds transparent
        let colorTransparent = UIColor.init(displayP3Red: 0, green: 0, blue: 0, alpha: 0)
        UITableView.appearance().backgroundColor = colorTransparent
        UITableViewCell.appearance().backgroundColor = colorTransparent
        
        // Google Maps and Places
        GMSServices.provideAPIKey("AIzaSyDhZI9uJRMpdDD96ITk38_AhRwyfCEEI9k")
        GMSPlacesClient.provideAPIKey("AIzaSyDhZI9uJRMpdDD96ITk38_AhRwyfCEEI9k")
        
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

