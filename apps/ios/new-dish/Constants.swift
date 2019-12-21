class Constants {
    static let homeInitialDrawerHeight = Screen.height * 0.68
    static let homeInitialDrawerFullHeight = Screen.height - 70
}

class Mocks {
    static let galleryVisibleDish = Store<AppState, AppAction>.init(
        initialState: AppState(
            galleryDish: features[0]
        ),
        reducer: appReducer
    )
    
    static let homeSearchedPho = Store<AppState, AppAction>.init(
        initialState: AppState(
            homeState: [HomeState(search: "Pho")]
        ),
        reducer: appReducer
    )
    
    static let defaultState = Store<AppState, AppAction>.init(
        initialState: AppState(),
        reducer: appReducer
    )
}
