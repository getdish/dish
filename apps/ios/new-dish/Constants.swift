class Constants {
    static let homeInitialDrawerHeight = Screen.height * 0.7
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
            homeState: [HomeState(), HomeState(dish: "Pho")]
        ),
        reducer: appReducer
    )
    
    static let defaultState = Store<AppState, AppAction>.init(
        initialState: AppState(),
        reducer: appReducer
    )
}
