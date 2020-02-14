import Combine
import GoogleMaps

class MapService {
    let geocoder = GMSGeocoder()
    let currentLocationManager = CurrentLocationService()
    var cancels: Set<AnyCancellable> = []
    
    enum MapServiceError: Error {
        case noLocationResults
    }
    
    func start() {
        currentLocationManager.start()
        self.effectUpdateCurrentLocation()
        self.effectMoveToCurrentLocationOnAuthorization()
    }
    
    func setNameOfCurrentLocation(_ location: CLLocation) -> Effect<AppAction> {
        self.getReverseGeo(location.coordinate)
            .replaceError(with: GMSAddress())
            .map { location in
                AppAction.map(.setLocationLabel("\(location.locality ?? "no locality")"))
            }
            .eraseToEffect()
    }
    
    func effectUpdateCurrentLocation() {
        currentLocationManager.$lastLocation
            .sink { location in
                print("last location is \(location)")
                if let location = location {
                    App.store.send(.map(.setLastKnown(location)))
                    App.store.send(self.setNameOfCurrentLocation(location))
                }
            }
            .store(in: &cancels)
    }
    
    func effectMoveToCurrentLocationOnAuthorization() {
        currentLocationManager.$authorized
            .sink { authorized in
                if !App.store.state.map.hasChangedOnce {
                    App.store.send(.map(.moveToLocation(.init(center: .current))))
                }
            }
            .store(in: &cancels)
    }
    
    func getReverseGeo(_ location: CLLocationCoordinate2D) -> AnyPublisher<GMSAddress, Error> {
        return Future<GMSAddress, Error> { promise in
            self.geocoder.reverseGeocodeCoordinate(location) { (res, err) in
                if let error = err {
                    promise(.failure(error))
                } else {
                    if let response = res,
                        let firstResponse = response.firstResult() {
                        promise(.success(firstResponse))
                    } else {
                        promise(.failure(MapServiceError.noLocationResults))
                    }
                }
            }
        }
        .eraseToAnyPublisher()
    }
}

