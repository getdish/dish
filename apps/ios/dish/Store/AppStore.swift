import Foundation

// state
struct AppState: Equatable {
  var home = HomeState()
  var map = MapState()
  var camera = CameraState()
  var view: HomePageView = .home
  var debugShowMap = 0
  var appLoaded = false
  var showSplash = true
}

// action
enum AppAction {
  case setView(_ page: HomePageView)
  case home(_ action: HomeAction)
  case map(_ action: MapAction)
  case camera(_ action: CameraAction)
  case setDebugShowMap(_ val: Int)
  case setAppLoaded
  case hideSplash
}

// select
struct AppSelect {
  var home = HomeSelectors()
}

// Selectors
let Selectors = AppSelect()

// reducer
func appReducer(state: inout AppState, action: AppAction) {
  switch action {
    case let .setView(page):
      state.view = page
  case let .home(action):
    homeReducer(&state, action: action)
  case let .map(action):
    mapReducer(&state, action: action)
  case let .camera(action):
    cameraReducer(&state, action: action)
  case let .setDebugShowMap(val):
    state.debugShowMap = val
  case .setAppLoaded:
    state.appLoaded = true
  case .hideSplash:
    state.showSplash = false
  }
}

typealias AppStore = Store<AppState, AppAction>
