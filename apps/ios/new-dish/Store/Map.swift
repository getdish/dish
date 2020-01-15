import Combine
import GooglePlaces
import GoogleMaps
import CoreLocation

fileprivate let placesClient = GMSPlacesClient.shared()
fileprivate let manager = CLLocationManager()

extension AppState {
    struct MapState: Equatable {
        var location = MapLocationState(
            radius: 8000,
            latitude: 0.0,
            longitude: 0.0
        )
        var locationLabel: String = ""
        var showSearch = false
        var search = ""
        var searchResults: [CLLocation] = []
        var lastKnown: CLLocation? = nil
        var isOnCurrent = false
        var hasChangedOnce = false
        var likelyPlaces: [GMSPlace] = []
    }
}

enum MapAction {
    case setLocation(_ location: MapLocationState)
    case setLocationLabel(_ val: String)
    case listLikelyPlaces
    case setLikelyPlaces(_ locations: [GMSPlace])
    case goToCurrent
    case setLastKnown(_ location: CLLocation?)
    case setSearch(_ search: String)
    case setSearchResults(_ locations: [CLLocation])
}

func mapReducer(_ state: inout AppState, action: MapAction) {
    switch action {
        case let .setLocation(location):
            state.map.location = location
        case let .setLocationLabel(val):
            state.map.locationLabel = val
        case .goToCurrent:
            state.map.isOnCurrent = true
        case let .setLastKnown(location):
            state.map.lastKnown = location
        case let .setSearchResults(locations):
            state.map.searchResults = locations
        case let .setSearch(search):
            state.map.search = search
        case let .setLikelyPlaces(locations):
            state.map.likelyPlaces = locations
        case .listLikelyPlaces:
            state.map.likelyPlaces.removeAll()
    }
}

struct MapLocationState: Equatable {
    var radius: Double
    var latitude: Double
    var longitude: Double
}
