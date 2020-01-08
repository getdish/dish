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
    var locations: [GooglePlaceItem] = []
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
        let currentLocation = LocationManager()
        var cancels: Set<AnyCancellable> = []
        
        init(_ mapView: MapView) {
            self.mapView = mapView
            super.init()
            self.update(mapView)
            self.currentLocation.start()
            
            // hacky dealy for now because mapView isn't started yet
            DispatchQueue.main.asyncAfter(deadline: .now() + .seconds(1)) {
                self.currentLocation.$lastLocation
                    .sink { location in
                        if location != nil {
                            log.info("center map from lastLocation")
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
    }
}

class MapViewController: UIViewController {
    // want to default to city level view
    var zoom: CGFloat
    var gmapView: GMSMapView!
    var currentLocation: CLLocation?
    var locations: [GooglePlaceItem] = []
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
        if self.locations != mapView.locations {
            print("update locations...")
            self.locations = mapView.locations
            self.locations.forEach { place in
                let location = place.geometry.location
                let position = CLLocationCoordinate2D(latitude: Double(location.lat), longitude: Double(location.lng))
                let marker = GMSMarker(position: position)
                marker.title = "\(place.name)"
//                marker.iconView = markerView
                marker.tracksViewChanges = true
                marker.map = self.gmapView
            }
        }
    }
    
    func updateZoom(_ nextZoom: CGFloat) {
        self.zoom = nextZoom
        self.updateCamera()
    }
    
    func moveMapToCurrentLocation() {
        if gmapView == nil { return }
        self.gmapView.isMyLocationEnabled = true
        self.updateCamera()
    }
    
    private func updateCamera() {
        if let camera = getCamera() {
            if gmapView.isHidden {
                gmapView.isHidden = false
                gmapView.camera = camera
            } else {
                // TODO option MapView(animateCamera: true) for snapToBottom
                gmapView.camera = camera
//                gmapView.animate(to: camera)
            }
        }
    }
    
    // converts 0-1
    private func absZoom(_ number: Double? = nil) -> Double {
        let min = 10.0
        let max = 13.0
        return ((number ?? Double(self.zoom)) - min) / (max - min) * 1.0
    }
    
    private var adjustLatitude: Double {
        let zoom = absZoom()
        let zoomLat = zoom * 0.4 * Constants.ONE_DEGREE_LAT
        let constLat = (-Constants.ONE_DEGREE_LAT * 0.9)
        var z = zoomLat + constLat
        if zoom < 0.6 {
            z = z - (0.6 - zoom) * Constants.ONE_DEGREE_LAT * 7
        }
        print("now it is \(z) \(absZoom())")
        return z
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
                gmapView.mapStyle = try! GMSMapStyle(contentsOfFileURL: styleURL)
            } else {
                print("WHAT THE FUCK")
            }
        } else {
            if let styleURL = Bundle.main.url(forResource: "GMapsThemeLight", withExtension: "json") {
                gmapView.mapStyle = try! GMSMapStyle(contentsOfFileURL: styleURL)
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
        gmapView = GMSMapView.map(withFrame: CGRect(x: 0, y: 0, width: width, height: height), camera: camera)
        
        self.loadTheme()
        
        // allows gestures to go up to parent
        gmapView.settings.consumesGesturesInView = true
        
        // disable mouse move
        //    mapView.settings.scrollGestures = false
        
        self.view.addSubview(gmapView)
        
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
                gmapView.isHidden = false
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
