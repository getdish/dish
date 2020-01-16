import Foundation

// state
struct AppState {
    var home = HomeState()
    var map = MapState()
    var camera = CameraState()
    var disableTopNav = false
}

// action
enum AppAction {
    case home(_ action: HomeAction)
    case map(_ action: MapAction)
    case camera(_ action: CameraAction)
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
        case let .map(action):
            mapReducer(&state, action: action)
        case let .camera(action):
            cameraReducer(&state, action: action)
        case let .setDisableTopNav(val):
            state.disableTopNav = val
    }
}

typealias AppStore = Store<AppState, AppAction>
