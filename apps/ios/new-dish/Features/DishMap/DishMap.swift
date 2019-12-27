import SwiftUI
import GooglePlaces
import CoreLocation

struct DishMapView: View {
    var width: CGFloat
    var height: CGFloat
    
    // start location manager
    let locationManager = LocationManager()
    
    @Environment(\.colorScheme) var colorScheme
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        MapView(
            width: width,
            height: height,
            darkMode: self.colorScheme == .dark,
            location: store.state.location.isOnCurrent ? .current : .uncontrolled
        )
            .onAppear {
                self.locationManager.start()
        }
        .onDisappear {
            self.locationManager.stop()
        }
    }
}

class LocationManager: NSObject, CLLocationManagerDelegate {
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
        print("getting location")
        appStore.send(.location(.setLastKnown(locations.last)))
        //        AppAction.location(.setLikelyPlaces(locations)
    }
    
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        print("locationManager statuss \(status)")
        if status == .authorizedWhenInUse {
            manager.startUpdatingLocation()
            if !appStore.state.location.hasChangedOnce {
                appStore.send(.location(.goToCurrent))
            }
        }
    }
}
