//
//  AppState.swift
//  new-dish
//
//  Created by Majid Jabrayilov on 12/5/19.
//  Copyright © 2019 Majid Jabrayilov. All rights reserved.
//
import Foundation

enum HomePageView {
    case home, camera
}

struct AppState {
    var homePageView: HomePageView = .home
}

enum AppAction {
    case changeHomePage(_ page: HomePageView)
}

let appReducer = Reducer<AppState, AppAction> { state, action in
    switch action {
        case let .changeHomePage(page):
            state.homePageView = page
    }
}
