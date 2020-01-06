import SwiftUI
import Combine
import GoogleMaps

// TODO this can be a generic view again in Views/
// just need to clean it up a little

fileprivate struct Constants {
    static let ONE_DEGREE_LAT: Double = 7000 / 111111
}

struct MapView: UIViewControllerRepresentable {
    enum MapLocation {
        case current, uncontrolled
    }
    
    var width: CGFloat
    var height: CGFloat
    var zoom: CGFloat
    var darkMode: Bool?
    var location: MapLocation
    @State var controller: MapViewController? = nil

    func makeCoordinator() -> MapView.Coordinator {
        Coordinator(self)
    }
    
    func makeUIViewController(context: Context) -> UIViewController {
        let controller = MapViewController(
            width: width,
            height: height,
            zoom: zoom,
            darkMode: darkMode
        )
        DispatchQueue.main.async {
            self.controller = controller
        }
        return controller
    }
    
    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        context.coordinator.update(self)
    }
    
    class Coordinator: NSObject {
        var mapView: MapView
        let locationManager = LocationManager()
        var cancels: Set<AnyCancellable> = []
        
        init(_ mapView: MapView) {
            self.mapView = mapView
            super.init()
            self.update(mapView)
            self.locationManager.start()
            
            // hacky dealy for now because mapView isn't started yet
            DispatchQueue.main.asyncAfter(deadline: .now() + .seconds(2)) {
                self.locationManager.$lastLocation
                    .sink { location in
                        if location != nil {
                            self.mapView.controller!.moveMapToCurrentLocation()
                        }
                    }
                .store(in: &self.cancels)
            }
        }
        
        func update(_ mapView: MapView) {
            DispatchQueue.main.async {
                self.mapView.controller?.update(mapView)
            }
        }
        
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
                appStore.send(.location(.setLastKnown(locations.last)))
                self.lastLocation = locations.last
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

    }
}

class MapViewController: UIViewController {
    // want to default to city level view
    var zoom: CGFloat
    var mapView: GMSMapView!
    var currentLocation: CLLocation?
    var width: CGFloat
    var height: CGFloat
    var darkMode: Bool?
    
    init(width: CGFloat, height: CGFloat, zoom: CGFloat?, darkMode: Bool?) {
        self.zoom = zoom ?? 12.0
        self.width = width
        self.height = height
        self.darkMode = darkMode
        super.init(nibName: nil, bundle: nil)
    }
    
    func update(_ mapView: MapView) {
        if self.zoom != mapView.zoom {
            self.updateZoom(mapView.zoom)
        }
    }
    
    func updateZoom(_ nextZoom: CGFloat) {
        self.zoom = nextZoom
        self.updateCamera()
    }
    
    func moveMapToCurrentLocation() {
        if mapView == nil { return }
        self.mapView.isMyLocationEnabled = true
        self.updateCamera()
    }
    
    private func updateCamera() {
        if let camera = getCamera() {
            if mapView.isHidden {
                mapView.isHidden = false
                mapView.camera = camera
            } else {
                mapView.animate(to: camera)
            }
        }
    }
    
    // https://gis.stackexchange.com/questions/2951/algorithm-for-offsetting-a-latitude-longitude-by-some-amount-of-meters
    private var adjustLatitude: Double {
        let zoomAdjusted: Double = Double(max(0.1, (zoom - 10)) * 0.5)
        let zoomAdjustY: Double = zoomAdjusted * Constants.ONE_DEGREE_LAT
        let constAdjustY: Double = -Constants.ONE_DEGREE_LAT * 2
        print("get lat \(zoom) - \(zoomAdjusted) - \(zoomAdjustY)")
        return constAdjustY + zoomAdjustY
    }
    
    private func getCamera() -> GMSCameraPosition? {
        if let location: CLLocation = appStore.state.location.lastKnown {
            return GMSCameraPosition.camera(
                withLatitude: location.coordinate.latitude + self.adjustLatitude,
                longitude: location.coordinate.longitude,
                zoom: Float(zoom)
            )
        }
        return nil
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func loadTheme() {
        if darkMode == true {
            if let styleURL = Bundle.main.url(forResource: "GMapsThemeModest", withExtension: "json") {
                mapView.mapStyle = try! GMSMapStyle(contentsOfFileURL: styleURL)
            } else {
                print("WHAT THE FUCK")
            }
        } else {
            if let styleURL = Bundle.main.url(forResource: "GMapsThemeLight", withExtension: "json") {
                mapView.mapStyle = try! GMSMapStyle(contentsOfFileURL: styleURL)
            } else {
                print("WHAT THE FUCK")
            }
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        print("view did load...")
        
        // Create a GMSCameraPosition that tells the map to display the
        // coordinate -33.86,151.20 at zoom level 6.
        let camera = GMSCameraPosition.camera(withLatitude: -33.86, longitude: 151.20, zoom: 4.0)
        mapView = GMSMapView.map(withFrame: CGRect(x: 0, y: 0, width: width, height: height), camera: camera)
        
        self.loadTheme()
        
        // allows gestures to go up to parent
        mapView.settings.consumesGesturesInView = true
        
        // disable mouse move
        //    mapView.settings.scrollGestures = false
        
        self.view.addSubview(mapView)
        
        // Creates a marker in the center of the map.
        //    let marker = GMSMarker()
        //    marker.position = CLLocationCoordinate2D(latitude: -33.86, longitude: 151.20)
        //    marker.title = "Sydney"
        //    marker.snippet = "Australia"
        //    marker.map = mapView
    }
}

extension MapViewController {
    // Handle authorization for the location manager.
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        switch status {
            case .restricted:
                print("Location access was restricted.")
            case .denied:
                print("User denied access to location.")
                // Display the map using the default location.
                mapView.isHidden = false
            case .notDetermined:
                print("Location status not determined.")
            case .authorizedAlways: fallthrough
            case .authorizedWhenInUse:
                print("Location status is OK.")
            @unknown default:
                fatalError()
        }
    }
}
