import SwiftUI
import Combine
import GoogleMaps

class LocationManager: NSObject, CLLocationManagerDelegate, ObservableObject {
    @Published var lastLocation: CLLocation? = nil
    
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
                log.info("setting location \(next.coordinate.latitude) \(next.coordinate.longitude)")
                appStore.send(.location(.setLastKnown(next)))
                self.lastLocation = next
            }
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        log.info()
        if status == .authorizedWhenInUse {
            manager.startUpdatingLocation()
            if !appStore.state.location.hasChangedOnce {
                appStore.send(.location(.goToCurrent))
            }
        }
    }
}
