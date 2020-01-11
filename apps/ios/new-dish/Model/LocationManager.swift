import SwiftUI
import Combine
import GoogleMaps

class LocationManager: NSObject, CLLocationManagerDelegate, ObservableObject {
    @Published var lastLocation: CLLocation? = nil
    
    private let manager = CLLocationManager()
    
    func start() {
        manager.delegate = self
        manager.requestWhenInUseAuthorization()
        manager.startUpdatingLocation()
    }
    
    func stop() {
        manager.stopUpdatingLocation()
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        let last = self.lastLocation
        if let next = locations.last {
            if last == nil || next.distance(from: last!) > 4.0 { // in meters
                appStore.send(.location(.setLastKnown(next)))
                self.lastLocation = next
            }
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        if status == .authorizedWhenInUse {
            manager.startUpdatingLocation()
            if !appStore.state.location.hasChangedOnce {
                appStore.send(.location(.goToCurrent))
            }
        }
    }
}
