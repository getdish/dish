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

}
