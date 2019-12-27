import Foundation

// state
struct AppState {
    var home = HomeState()
    var location = LocationState()
}

// action
enum AppAction {
    case home(_ action: HomeAction)
    case location(_ action: LocationAction)
}

// select
struct AppSelect {}

// reducer
let appReducer = Reducer<AppState, AppAction> { state, action in
    switch action {
        case let .home(action):
            homeReducer(&state, action: action)
        case let .location(action):
            locationReducer(&state, action: action)        
    }
}

typealias AppStore = Store<AppState, AppAction>
