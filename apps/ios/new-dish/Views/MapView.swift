import SwiftUI
import GoogleMaps

struct MapView: UIViewControllerRepresentable {
    var width: CGFloat
    var height: CGFloat
    var darkMode: Bool?

    func makeCoordinator() -> MapView.Coordinator {
        Coordinator(
            MapViewController(
                width: width,
                height: height,
                darkMode: darkMode
            )
        )
    }
    
    func updateUIViewController(_ uiViewController: UIViewController, context: UIViewControllerRepresentableContext<MapView>) {
        print("MapView should update the controller now")
        context.coordinator.update()
    }
    
    func makeUIViewController(context: UIViewControllerRepresentableContext<MapView>) -> UIViewController {
        MapViewController(
            width: width,
            height: height,
            darkMode: darkMode
        )
    }
    
    class Coordinator: NSObject {
        var controller: MapViewController
        
        init(_ controller: MapViewController) {
            self.controller = controller
            super.init()
            self.update()
        }
        
        func update() {
            
        }
    }
}

class MapViewController: UIViewController {
//    @ObservedObject var locationStore = Store.location
    
    // want to default to city level view
    var zoomLevel: Float = 12.0
    var mapView: GMSMapView!
    var currentLocation: CLLocation?
    var width: CGFloat
    var height: CGFloat
    var darkMode: Bool?
    
    init(width: CGFloat, height: CGFloat, darkMode: Bool?) {
        self.width = width
        self.height = height
        self.darkMode = darkMode
        super.init(nibName: nil, bundle: nil)

//        self.locationStore.$isOnCurrentLocation.map { isOn in
//            if isOn {
//                self.zoomMapToCurrentLocation()
//            }
//        }
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
    func zoomMapToCurrentLocation() {
//        let location: CLLocation = self.locationStore.locations.last!
//        print("Location: \(location)")
//        
//        let camera = GMSCameraPosition.camera(
//            withLatitude: location.coordinate.latitude,
//            longitude: location.coordinate.longitude,
//            zoom: zoomLevel
//        )
//        
//        if mapView.isHidden {
//            mapView.isHidden = false
//            mapView.camera = camera
//        } else {
//            mapView.animate(to: camera)
//        }
    }
    
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
