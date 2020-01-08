import Foundation

// state
struct AppState {
    var home = HomeState()
    var location = LocationState()
    var disableTopNav = false
}

// action
enum AppAction {
    case home(_ action: HomeAction)
    case location(_ action: LocationAction)
    case setDisableTopNav(_ val: Bool)
}

// select
struct AppSelect {
    var home = HomeSelectors()
}

// Selectors
let Selectors = AppSelect()

// reducer
let appReducer = Reducer<AppState, AppAction> { state, action in
    switch action {
        case let .home(action):
            homeReducer(&state, action: action)
        case let .location(action):
            locationReducer(&state, action: action)
        case let .setDisableTopNav(val):
            state.disableTopNav = val
    }
}

typealias AppStore = Store<AppState, AppAction>
