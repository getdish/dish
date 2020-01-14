import Combine
import GoogleMaps

// uses a delegate so separate it out...
class CurrentLocationService: NSObject, CLLocationManagerDelegate, ObservableObject {
    @Published var lastLocation: CLLocation? = nil
    @Published var authorized = false
    
    private let manager = CLLocationManager()
    
    func start() {
        log.info()
        manager.delegate = self
        manager.requestWhenInUseAuthorization()
        manager.startUpdatingLocation()
    }
    
    func stop() {
        log.info()
        manager.stopUpdatingLocation()
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        log.info("locations.count \(locations.count)")
        let last = self.lastLocation
        if let next = locations.last {
            log.info("got location")
            if last == nil || next.distance(from: last!) > 4.0 { // in meters
                log.info("got new location \(next.coordinate.latitude) \(next.coordinate.longitude)")
                self.lastLocation = next
            }
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        log.info()
        if status == .authorizedWhenInUse {
            manager.startUpdatingLocation()
            self.authorized = true
        }
    }
}
