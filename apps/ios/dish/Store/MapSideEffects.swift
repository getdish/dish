import Combine
import MapKit

class MapSideEffects {
  //    let geocoder = GMSGeocoder()
  let currentLocationManager = CurrentLocationService()

  var cancels: Set<AnyCancellable> = []

  enum MapServiceError: Error {
    case noLocationResults
  }

  func start(_ store: AppStore) {
    currentLocationManager.start()
    self.effectMoveToCurrentLocationOnAuthorization(store)
  }
  
  func effectMoveToCurrentLocationOnAuthorization(_ store: AppStore) {
    currentLocationManager.$authorized
      .sink { authorized in
        if !store.state.home.hasChangedOnce {
          store.send(.map(.moveToLocation(MapViewLocation(center: .current))))
        }
    }
    .store(in: &cancels)
  }

  //    func setNameOfCurrentLocation(_ location: CLLocation) -> Effect<AppAction> {
  //        self.getReverseGeo(location.coordinate)
  //            .replaceError(with: GMSAddress())
  //            .map { location in
  //                AppAction.map(.setLocationLabel("\(location.locality ?? "no locality")"))
  //            }
  //            .eraseToEffect()
  //    }

  //    func effectUpdateCurrentLocation() {
  //        currentLocationManager.$lastLocation
  //            .sink { location in
  //                print("last location is \(location)")
  //                if let location = location {
  //                    App.store.send(.map(.setLastKnown(location)))
  //                    App.store.send(self.setNameOfCurrentLocation(location))
  //                }
  //            }
  //            .store(in: &cancels)
  //    }

  //    func getReverseGeo(_ location: CLLocationCoordinate2D) -> AnyPublisher<GMSAddress, Error> {
  //        return Future<GMSAddress, Error> { promise in
  //            self.geocoder.reverseGeocodeCoordinate(location) { (res, err) in
  //                if let error = err {
  //                    promise(.failure(error))
  //                } else {
  //                    if let response = res,
  //                        let firstResponse = response.firstResult() {
  //                        promise(.success(firstResponse))
  //                    } else {
  //                        promise(.failure(MapServiceError.noLocationResults))
  //                    }
  //                }
  //            }
  //        }
  //        .eraseToAnyPublisher()
  //    }
}
