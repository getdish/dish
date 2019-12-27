import Foundation
import GooglePlaces


// state
struct AppState {
    var home = Home()
    
    // location
    var showLocationSearch = false
    var locationSearch = ""
    var locationSearchResults: [CLLocation] = []
    var lastKnownLocation: CLLocation? = nil
    var isOnCurrentLocation = false
    var hasChangedLocationOnce = false
    
    // gallery
    var galleryDish: DishItem? = nil
}

// selectors
struct AppStateSelect {}


enum AppAction {
    case home(_ action: HomeAction)
    case goToCurrentLocation
    case setLastKnownLocation(_ location: CLLocation?)
    case setLocationSearch(_ search: String)
    case setLocationSearchResults(_ locations: [CLLocation])
    case setGalleryDish(_ dish: DishItem?)
    case closeGallery
}

let appReducer = Reducer<AppState, AppAction> { state, action in
    switch action {
        case let .home(action):
            homeReducer(&state, action: action)
        case .goToCurrentLocation:
            state.isOnCurrentLocation = true
        case let .setLastKnownLocation(location):
            state.lastKnownLocation = location
        case let .setLocationSearchResults(locations):
            state.locationSearchResults = locations
        case let .setLocationSearch(search):
            state.locationSearch = search
        case let .setGalleryDish(dish):
            state.galleryDish = dish
        case .closeGallery:
            state.galleryDish = nil
        
    }
}


typealias AppStore = Store<AppState, AppAction>
