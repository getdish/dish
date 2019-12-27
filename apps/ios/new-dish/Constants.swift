class Constants {
    static let homeInitialDrawerHeight = Screen.height * 0.7
    static let homeInitialDrawerFullHeight = Screen.height - 70
}

class Mocks {
    static let homeSearchedPho = Store<AppState, AppAction>.init(
        initialState: AppState(
            home: AppState.HomeState(
                current: [HomeStateItem(), HomeStateItem(dish: "Pho")]
            )
        ),
        reducer: appReducer
    )
    
    static let defaultState = Store<AppState, AppAction>.init(
        initialState: AppState(),
        reducer: appReducer
    )
}
