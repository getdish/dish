//
//  AppState.swift
//  new-dish
//
//  Created by Majid Jabrayilov on 12/5/19.
//  Copyright © 2019 Majid Jabrayilov. All rights reserved.
//
import Foundation
import GooglePlaces

enum HomePageView {
    case home, camera
}

struct AppState {
    // home
    var homePageView: HomePageView = .home
    var showDrawer = true
    
    // home 2.0
    var homeState: [HomeState] = [HomeState()]
    
    // location
    var showLocationSearch = false
    var locationSearch = ""
    var locationSearchResults: [CLLocation] = []
    var lastKnownLocation: CLLocation? = nil
    var isOnCurrentLocation = false
    var hasChangedLocationOnce = false
    
    // gallery
    var galleryDish: Landmark? = nil
}

struct HomeState {
    var search = ""
}

enum AppAction {
    case changeHomePage(_ page: HomePageView)
    case setShowDrawer(_ val: Bool)
    case pushHomeState(_ state: HomeState)
    case toggleDrawer
    case goToCurrentLocation
    case setLastKnownLocation(_ location: CLLocation?)
    case setLocationSearch(_ search: String)
    case setLocationSearchResults(_ locations: [CLLocation])
    case setGalleryDish(_ dish: Landmark?)
    case closeGallery
}

let appReducer = Reducer<AppState, AppAction> { state, action in
    switch action {
        case let .changeHomePage(page):
            state.homePageView = page
        case let .setShowDrawer(val):
            state.showDrawer = val
        case .toggleDrawer:
            state.showDrawer = !state.showDrawer
        case .goToCurrentLocation:
            state.isOnCurrentLocation = true
        case let .setLastKnownLocation(location):
            state.lastKnownLocation = location
        case let .setLocationSearchResults(locations):
            state.locationSearchResults = locations
        case let .setLocationSearch(search):
            state.locationSearch = search
        case let .setGalleryDish(dish):
            state.galleryDish = dish
        case .closeGallery:
            state.galleryDish = nil
        case let .pushHomeState(homeState):
            state.homeState.append(homeState)
        
    }
}

typealias AppStore = Store<AppState, AppAction>
