class Mocks {
  static let homeSearchedPho = Store<AppState, AppAction>.init(
    initialState: AppState(
      home: AppState.HomeState(
        viewStates: [HomeStateItem(), HomeStateItem(state: .search(search: "Pho"))]
      )
    ),
    reducer: appReducer
  )

  static let homeSearchedPhoSelectedRestaurant = Store<AppState, AppAction>.init(
    initialState: AppState(
      home: AppState.HomeState(
        viewStates: [
          HomeStateItem(),
          HomeStateItem(state: .restaurantDetail(restaurant: restaurants[0])),
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
