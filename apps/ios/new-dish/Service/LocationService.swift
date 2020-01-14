import Combine
import GoogleMaps

class LocationService {
    let geocoder = GMSGeocoder()
    let currentLocationManager = CurrentLocationService()
    var cancels: Set<AnyCancellable> = []
    
    enum LocationServiceError: Error {
        case noLocationResults
    }
    
    func start() {
        self.effectUpdateCurrentLocation()
        self.effectMoveToCurrentLocationOnAuthorization()
    }
    
    func setNameOfCurrentLocation(_ location: CLLocation) -> Effect<AppAction> {
        self.getReverseGeo(location.coordinate)
            .replaceError(with: GMSAddress())
            .map { location in
                AppAction.home(.setMapBoundsLabel("\(location.locality ?? "no locality")"))
            }
            .eraseToEffect()
    }
    
    func effectUpdateCurrentLocation() {
        currentLocationManager.$lastLocation
            .sink { location in
                if let location = location {
                    appStore.send(.location(.setLastKnown(location)))
                    appStore.send(self.setNameOfCurrentLocation(location))
                }
            }
            .store(in: &cancels)
    }
    
    func effectMoveToCurrentLocationOnAuthorization() {
        currentLocationManager.$authorized
            .sink { authorized in
                if !appStore.state.location.hasChangedOnce {
                    appStore.send(.location(.goToCurrent))
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
                        promise(.failure(LocationServiceError.noLocationResults))
                    }
                }
            }
        }
        .eraseToAnyPublisher()
    }
}

