import Combine
import CoreLocation

fileprivate let manager = CLLocationManager()

extension AppState {
  struct MapState: Equatable {
    var location: MapViewLocation = .init(center: .current)
    var moveToLocation: MapViewLocation = .init(center: .current)
    var locationLabel: String = "Map Area"
    var search = ""
    var searchResults: [CLLocation] = []
    var lastKnown: CLLocation? = nil
    var hasChangedOnce = false
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
    state.map.moveToLocation = .init(
      center: .current, radius: state.map.location.radius, refresh: true)
  case let .moveToLocation(loc):
    state.map.moveToLocation = loc
    // we track if they have moved off center or not
    if loc.center == .current {
      state.map.hasChangedOnce = false
    } else {
      state.map.hasChangedOnce = true
    }
  case let .setLastKnown(location):
    state.map.lastKnown = location
  }
}

struct MapLocationState: Equatable {
  var radius: Double
  var latitude: Double
  var longitude: Double
}
