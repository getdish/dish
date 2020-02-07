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
    
    // dynamic
    var enterRepl = false
    
    // flags
    let enableMap = false
    let enableMapAutoZoom = false
    let enableContent = false
    let enableCamera = true
    
    // constants
    let animationSpeed: Double = 1
    let keyboard = Keyboard()
    let queueMain = DispatchQueue.main
    let magicItems = magicItemsStore
    let searchBarLabelHeight: CGFloat = 26
    let searchBarHeight: CGFloat = 50
    let topNavHeight: CGFloat = 58
    let topNavPad: CGFloat = 14
    let cameraButtonHeight: CGFloat = 44
    let filterBarHeight: CGFloat = 60
    let filterBarPad: CGFloat = 16
    
    func start() {
        mapService.start()
        homeService.start()
    }
}
