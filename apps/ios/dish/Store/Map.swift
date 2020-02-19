import Combine
import GooglePlaces
import GoogleMaps
import CoreLocation

fileprivate let placesClient = GMSPlacesClient.shared()
fileprivate let manager = CLLocationManager()

extension AppState {
    struct MapState: Equatable {
        var location: MapViewLocation? = nil
        var moveToLocation: MapViewLocation? = nil
        var locationLabel: String = ""
        var search = ""
        var searchResults: [CLLocation] = []
        var lastKnown: CLLocation? = nil
        var hasChangedOnce = false
        var likelyPlaces: [GMSPlace] = []
    }
}

enum MapAction {
    case setLocation(_ location: MapViewLocation)
    case setLocationLabel(_ val: String)
    case moveToLocation(_ location: MapViewLocation)
    case moveToCurrentLocation
    case setLastKnown(_ location: CLLocation?)
}

func mapReducer(_ state: inout AppState, action: MapAction) {
    switch action {
        case let .setLocation(location):
            state.map.location = location
        case let .setLocationLabel(val):
            state.map.locationLabel = val
        case .moveToCurrentLocation:
            state.map.moveToLocation = .init(center: .current, radius: state.map.location?.radius ?? 10000, refresh: true)
        case let .moveToLocation(loc):
            state.map.moveToLocation = loc
        case let .setLastKnown(location):
            state.map.lastKnown = location
    }
}

struct MapLocationState: Equatable {
    var radius: Double
    var latitude: Double
    var longitude: Double
}
