//
//  AppDelegate.swift
//  Dish
//
//  Created by Nathan Weinert on 11/11/19.
//  Copyright © 2019 Nate Wienert. All rights reserved.
//

import UIKit
import GoogleMaps
import GooglePlaces
import Firebase

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

  // entry point for app
  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    // SwiftUI bugfix list backgrounds transparent
    UITableView.appearance().backgroundColor = UIColor(named: "transparent")
    UITableViewCell.appearance().backgroundColor = UIColor(named: "transparent")
    
    // Firebase
    FirebaseApp.configure()
    
    // Google Maps and Places
    GMSServices.provideAPIKey("AIzaSyDhZI9uJRMpdDD96ITk38_AhRwyfCEEI9k")
    GMSPlacesClient.provideAPIKey("AIzaSyDhZI9uJRMpdDD96ITk38_AhRwyfCEEI9k")
    
    // Start stores
    Store.start()

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

