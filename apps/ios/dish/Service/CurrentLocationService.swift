import Combine
import MapKit

// uses a delegate so separate it out...
class CurrentLocationService: NSObject, CLLocationManagerDelegate, ObservableObject {
    @Published var lastLocation: CLLocation? = nil
    @Published var authorized = false
    
    private let manager = CLLocationManager()
    
    func start() {
        logger.info()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyBest
        manager.requestWhenInUseAuthorization()
        manager.startUpdatingLocation()
    }
    
    func stop() {
        logger.info()
        manager.stopUpdatingLocation()
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        let last = self.lastLocation
        if let next = locations.first {
            if last == nil || next.distance(from: last!) > 10.0 { // in meters
                logger.info("got new location \(next.coordinate.latitude) \(next.coordinate.longitude)")
                self.lastLocation = next
            }
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        logger.info()
        if status == .authorizedWhenInUse {
            manager.startUpdatingLocation()
            self.authorized = true
        }
    }
}
