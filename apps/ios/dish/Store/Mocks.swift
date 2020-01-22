class Mocks {
    static let homeSearchedPho = Store<AppState, AppAction>.init(
        initialState: AppState(
            home: AppState.HomeState(
                state: [HomeStateItem(), HomeStateItem(filters: [SearchFilter(name: "Pho")])]
            )
        ),
        reducer: appReducer
    )
    
    static let defaultState = Store<AppState, AppAction>.init(
        initialState: AppState(),
        reducer: appReducer
    )
}
