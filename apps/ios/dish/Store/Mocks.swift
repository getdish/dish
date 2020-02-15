class Mocks {
    let homeSearchedPho = Store<AppState, AppAction>.init(
        initialState: AppState(
            home: AppState.HomeState(
                viewStates: [HomeStateItem(), HomeStateItem(filters: [SearchFilter(name: "Pho")])]
            )
        ),
        reducer: appReducer
    )
    
    let homeSearchedPhoSelectedRestaurant = Store<AppState, AppAction>.init(
        initialState: AppState(
            home: AppState.HomeState(
                viewStates: [
                    HomeStateItem(),
                    HomeStateItem(filters: [SearchFilter(name: "Pho")]),
                    HomeStateItem(filters: [SearchFilter(name: "Pho")], restaurant: restaurants[0])
                ]
            )
        ),
        reducer: appReducer
    )
    
    let defaultState = Store<AppState, AppAction>.init(
        initialState: AppState(),
        reducer: appReducer
    )
}
