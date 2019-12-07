import GooglePlaces
import Combine
import CoreLocation

class LocationStore: NSObject, ObservableObject, CLLocationManagerDelegate {
  @Published(key: "hasChangedLocationOnce") private(set) var hasChangedLocationOnce = false
  @Published(key: "isOnCurrentLocation") private(set) var isOnCurrentLocation = false
  @Published private(set) var locations: [CLLocation] = []
  @Published private(set) var lastKnownLocation: CLLocation? = nil
  @Published private(set) var likelyPlaces: [GMSPlace] = []
  let placesClient = GMSPlacesClient.shared()
  
  private let manager: CLLocationManager
  
  init(manager: CLLocationManager = CLLocationManager()) {
    self.manager = manager
    super.init()
  }
  
  func start() {
    self.manager.delegate = self
    self.manager.requestWhenInUseAuthorization()
    self.manager.startUpdatingLocation()
  }
  
  func goToCurrentLocation() {
    self.isOnCurrentLocation = true
  }
  
  // Populate the array with the list of likely places.
  func listLikelyPlaces() {
    // Clean up from previous sessions.
    likelyPlaces.removeAll()
    placesClient.currentPlace(callback: { (placeLikelihoods, error) -> Void in
      if let error = error {
        // TODO: Handle the error.
        print("Current Place error: \(error.localizedDescription)")
        return
      }
      // Get likely places and add to the list.
      if let likelihoodList = placeLikelihoods {
        for likelihood in likelihoodList.likelihoods {
          let place = likelihood.place
          self.likelyPlaces.append(place)
        }
      }
    })
  }
  
  func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
    self.lastKnownLocation = locations.last
    self.locations = locations
  }
  
  func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
    if status == .authorizedWhenInUse {
      manager.startUpdatingLocation()
      
      if !hasChangedLocationOnce {
        self.isOnCurrentLocation = true
      }
    }
  }
}
