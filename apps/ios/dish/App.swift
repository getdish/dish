import SwiftUI

// For more information check "How To Control The World" - Stephen Celis
// https://vimeo.com/291588126

// basically, put your services here
// this is where side effects and basically any global should go

class AppInstance {
    let store = Store<AppState, AppAction>.init(initialState: AppState(), reducer: appReducer)
    
    // services
    let mapService = MapService()
    let homeService = HomeService()
    let googlePlacesService = GooglePlacesService()

    // constants
    let keyboard = Keyboard()
    let queueMain = DispatchQueue.main
    let magicItems = magicItemsStore
    // y so slow
    let enableMapAutoZoom = false
    
    let searchBarHeight: CGFloat = 54
    let topNavHeight: CGFloat = 54
    let topNavPad: CGFloat = 12
    let cameraButtonHeight: CGFloat = 52
    let filterBarHeight: CGFloat = 58
    let filterBarPad: CGFloat = 12
    
    var enterRepl = false
    
    func start() {
        mapService.start()
        homeService.start()
    }
}

let App = AppInstance()
