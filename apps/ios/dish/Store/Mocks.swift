class Mocks {
    static let homeSearchedPho = Store<AppState, AppAction>.init(
        initialState: AppState(
            home: AppState.HomeState(
                viewStates: [HomeStateItem(), HomeStateItem(dishes: [DishFilterItem(name: "Pho")])]
            )
        ),
        reducer: appReducer
    )
    
    static let homeSearchedPhoSelectedRestaurant = Store<AppState, AppAction>.init(
        initialState: AppState(
            home: AppState.HomeState(
                viewStates: [
                    HomeStateItem(),
                    HomeStateItem(dishes: [DishFilterItem(name: "Pho")]),
                    HomeStateItem(dishes: [DishFilterItem(name: "Pho")], restaurant: restaurants[0])
                ]
            )
        ),
        reducer: appReducer
    )
    
    static let defaultState = Store<AppState, AppAction>.init(
        initialState: AppState(),
        reducer: appReducer
    )
}
