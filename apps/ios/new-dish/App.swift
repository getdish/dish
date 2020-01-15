import SwiftUI

// For more information check "How To Control The World" - Stephen Celis
// https://vimeo.com/291588126

// basically, put your services here
// this is where side effects and basically any global should go

struct AppInstance {
    let store = Store<AppState, AppAction>.init(initialState: AppState(), reducer: appReducer)
    
    // services
    let mapService = MapService()
    let homeService = HomeService()
    let googlePlacesService = GooglePlacesService()

    let keyboard = Keyboard()
    let defaultQueue = DispatchQueue(label: "defaultQueue")
    
    func start() {
        mapService.start()
        homeService.start()
    }
}

let App = AppInstance()
