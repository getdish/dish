import GooglePlaces
import Combine
import CoreLocation

fileprivate let placesClient = GMSPlacesClient.shared()
fileprivate let manager = CLLocationManager()

extension AppState {
    struct LocationState: Equatable {
        var showSearch = false
        var search = ""
        var searchResults: [CLLocation] = []
        var lastKnown: CLLocation? = nil
        var isOnCurrent = false
        var hasChangedOnce = false
        var likelyPlaces: [GMSPlace] = []
    }
}

enum LocationAction {
    case listLikelyPlaces
    case setLikelyPlaces(_ locations: [GMSPlace])
    case goToCurrent
    case setLastKnown(_ location: CLLocation?)
    case setSearch(_ search: String)
    case setSearchResults(_ locations: [CLLocation])
}

func locationReducer(_ state: inout AppState, action: LocationAction) {
    switch action {
        case .goToCurrent:
            state.location.isOnCurrent = true
        case let .setLastKnown(location):
            state.location.lastKnown = location
        case let .setSearchResults(locations):
            state.location.searchResults = locations
        case let .setSearch(search):
            state.location.search = search
        case let .setLikelyPlaces(locations):
            state.location.likelyPlaces = locations
        case .listLikelyPlaces:
            state.location.likelyPlaces.removeAll()
//            placesClient.currentPlace(callback: { (placeLikelihoods, error) -> Void in
//                if let error = error {
//                    // TODO: Handle the error.
//                    print("Current Place error: \(error.localizedDescription)")
//                    return
//                }
//                // Get likely places and add to the list.
//                if let likelihoodList = placeLikelihoods {
//                    for likelihood in likelihoodList.likelihoods {
//                        let place = likelihood.place
//                        state.location.likelyPlaces.append(place)
//                    }
//                }
//            })
    }
}


class LocationManager: NSObject, CLLocationManagerDelegate {
    private let manager = CLLocationManager()
    
    func start() {
        manager.delegate = self
        manager.requestWhenInUseAuthorization()
        manager.startUpdatingLocation()
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        appStore.send(.location(.setLastKnown(locations.last)))
//        AppAction.location(.setLikelyPlaces(locations)
    }
    
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        if status == .authorizedWhenInUse {
            manager.startUpdatingLocation()
            if !appStore.state.location.hasChangedOnce {
                appStore.send(.location(.goToCurrent))
            }
        }
    }
}
