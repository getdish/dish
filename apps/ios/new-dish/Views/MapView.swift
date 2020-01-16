import SwiftUI
import Combine
import GoogleMaps

// TODO this can be a generic view again in Views/
// just need to clean it up a little

fileprivate struct Constants {
    static let ONE_DEGREE_LAT: Double = 7000 / 111111
}

struct MapViewLocation: Equatable {
    enum LocationType: Equatable {
        case current
        case location(lat: Double, long: Double)
        case none
    }
    let at: LocationType
    let time: NSDate
    init(_ at: LocationType) {
        self.at = at
        self.time = NSDate()
    }
    var coordinate: CLLocationCoordinate2D? {
        switch at {
            case .current: return nil
            case .none: return nil
            case .location(let lat, let long):
                return CLLocationCoordinate2D(latitude: lat, longitude: long)
        }
    }
}

struct CurrentMapPosition {
    let center: CLLocationCoordinate2D
    let location: CLLocation
    let radius: Double
}

typealias OnChangeSettle = (_ position: CurrentMapPosition) -> Void

struct MapView: UIViewControllerRepresentable {
    var width: CGFloat
    var height: CGFloat
    var hiddenBottomPct: CGFloat = 0
    var zoom: CGFloat
    var darkMode: Bool?
    var animate: Bool
    var moveToLocation: MapViewLocation?
    var locations: [GooglePlaceItem] = []
    var onMapSettle: OnChangeSettle?

    @State var controller: MapViewController? = nil

    func makeCoordinator() -> MapView.Coordinator {
        Coordinator(self)
    }

    func makeUIViewController(context: Context) -> UIViewController {
        let controller = MapViewController(
            width: width,
            height: height,
            hiddenBottomPct: hiddenBottomPct,
            moveToLocation: moveToLocation,
            locations: locations,
            zoom: zoom,
            darkMode: darkMode,
            animate: animate,
            onMapSettle: onMapSettle
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
        var parent: MapView

        init(_ parent: MapView) {
            self.parent = parent
            super.init()
            self.update(parent)
        }

        func update(_ parent: MapView) {
            DispatchQueue.main.async {
                self.parent.controller?.update(parent)
            }
        }
    }
}

class MapViewController: UIViewController, GMSMapViewDelegate {
    // want to default to city level view
    var zoom: CGFloat
    var gmapView: GMSMapView!
    var width: CGFloat
    var height: CGFloat
    var hiddenBottomPct: CGFloat
    var moveToLocation: MapViewLocation?
    var locations: [GooglePlaceItem] = []
    var darkMode: Bool?
    var animate = false
    var onMapSettle: OnChangeSettle?
    var lastSettledAt: CurrentMapPosition? = nil
    let currentLocationService = CurrentLocationService()
    var updateCancels: Set<AnyCancellable> = []
    var hasSettled: Bool = false

    init(
        width: CGFloat,
        height: CGFloat,
        hiddenBottomPct: CGFloat = 0,
        moveToLocation: MapViewLocation?,
        locations: [GooglePlaceItem] = [],
        zoom: CGFloat?,
        darkMode: Bool?,
        animate: Bool?,
        onMapSettle: OnChangeSettle? = nil
    ) {
        self.zoom = zoom ?? 12.0
        self.width = width
        self.height = height
        self.hiddenBottomPct = hiddenBottomPct
        self.moveToLocation = moveToLocation
        self.locations = locations
        self.darkMode = darkMode
        self.animate = animate ?? false
        self.onMapSettle = onMapSettle
        super.init(nibName: nil, bundle: nil)
        
        self.currentLocationService.start()
        
        DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(1000)) {
            self.hasSettled = true
        }
    }

    // delegate methods

    // on tap
    func mapView(_ mapView: GMSMapView, didTapAt coordinate: CLLocationCoordinate2D) {
        print("You tapped at \(coordinate.latitude), \(coordinate.longitude)")
    }

    // on move
    func mapView(_ mapView: GMSMapView, willMove gesture: Bool) {
    }
    
    var centerPoint: CGPoint {
        let x = gmapView.frame.size.width / 2
        let y = gmapView.frame.size.height / 2 * (1 - hiddenBottomPct)
        return CGPoint(x: x, y: y)
    }
    
    var centerCoordinate: CLLocationCoordinate2D {
        let topCenterCoor = gmapView.convert(self.centerPoint, from: gmapView)
        return gmapView.projection.coordinate(for: topCenterCoor)
    }

    // on map settle in new position
    func mapView(_ mapView: GMSMapView, idleAt cameraPosition: GMSCameraPosition) {
        self.callbackOnSettle()
    }

    // on move map camera
    func mapView(_ mapView: GMSMapView, didChange cameraPosition: GMSCameraPosition) {
//        let region = mapView.projection.visibleRegion()
//        print("moved map, new bounds \(region)")
    }
    
    func callbackOnSettle() {
        if !self.hasSettled {
            return
        }
        // TODO move this logic up
        if homeViewState.dragState != .idle || homeViewState.animationState != .idle {
            return
        }
        if let cb = onMapSettle {
            let next = CurrentMapPosition(
                center: centerCoordinate,
                location: CLLocation(latitude: centerCoordinate.latitude, longitude: centerCoordinate.longitude),
                radius: gmapView.getRadius() * Double(1 - self.hiddenBottomPct)
            )
            // only callback if we move above a threshold
            let shouldCallback = self.lastSettledAt == nil
                || self.lastSettledAt!.location.distance(from: next.location) > 1000
                || abs(abs(self.lastSettledAt!.radius) - abs(next.radius)) > 2000
            if shouldCallback {
                cb(next)
            }
            print("we settled at \(next)")
            self.lastSettledAt = next
        }
    }

    // on props update

    func update(_ parent: MapView) {
        // cancel any pending updates
        updateCancels.forEach { $0.cancel() }
        updateCancels = []
        
        if self.zoom != parent.zoom {
            log.info("update zoom \(parent.zoom)")
            self.updateZoom(parent.zoom)
        }
        if self.animate != parent.animate {
            log.info("update animate \(parent.animate)")
            self.animate = parent.animate
        }
        if self.locations != parent.locations {
            self.locations = parent.locations
            self.updateLocations()
        }
        if self.moveToLocation != parent.moveToLocation {
            self.moveToLocation = parent.moveToLocation
            self.updateMapLocation()
        }
        if self.hiddenBottomPct != parent.hiddenBottomPct {
            self.hiddenBottomPct = parent.hiddenBottomPct
            self.callbackOnSettle()
        }
    }
    
    func updateLocations() {
        log.info("update locations \(self.locations.count)")
        self.locations.forEach { place in
            let location = place.geometry.location
            let position = CLLocationCoordinate2D(latitude: Double(location.lat), longitude: Double(location.lng))
            let marker = GMSMarker(position: position)
            marker.title = "\(place.name)"
            //                marker.iconView = markerView
            marker.icon = UIImage(named: "pin")
            marker.tracksViewChanges = true
            marker.map = self.gmapView
        }
    }

    func updateZoom(_ nextZoom: CGFloat) {
        self.zoom = nextZoom
        self.updateCamera()
    }

    func updateMapLocation() {
        guard let moveTo = self.moveToLocation else { return }
        switch moveTo.at {
            case .current:
                self.moveToCurrentLocation()
            case .none:
                return
            case .location:
                self.updateCamera(moveTo.coordinate)
        }
    }
    
    func moveToCurrentLocation() {
        if let currentLocation = self.currentLocationService.lastLocation {
            log.info("currentLocation \(currentLocation)")
            self.updateCamera(currentLocation.coordinate)
        } else {
            // wait for location once
            var updated = false
            self.currentLocationService.$lastLocation
                .drop(while: { $0 == nil })
                .sink { loc in
                    if !updated {
                        updated = true
                        DispatchQueue.main.async {
                            let last = self.animate
                            self.animate = false
                            self.updateMapLocation()
                            self.animate = last
                        }
                    }
            }
            .store(in: &updateCancels)
        }
    }

    private func updateCamera(_ location: CLLocationCoordinate2D? = nil) {
        if let camera = getCamera(location) {
            if gmapView.isHidden {
                gmapView.isHidden = false
            }
            if self.animate {
                // to control animation duration... uncomment below
//                CATransaction.begin()
                // higher number = slower animation
//                CATransaction.setValue(1.5, forKey: kCATransactionAnimationDuration)
                gmapView.animate(to: camera)
//                CATransaction.commit()
            } else {
                gmapView.camera = camera
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

    private func getCamera(_ givenLoc: CLLocationCoordinate2D? = nil) -> GMSCameraPosition? {
        let location = givenLoc ?? self.lastSettledAt?.location.coordinate ?? gmapView.getCenterCoordinate()
        return GMSCameraPosition.camera(
            withLatitude: location.latitude + self.adjustLatitude,
            longitude: location.longitude,
            zoom: Float(zoom)
        )
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

        // Create a GMSCameraPosition that tells the map to display the
        // coordinate -33.86,151.20 at zoom level 6.
        let camera = GMSCameraPosition.camera(withLatitude: -33.86, longitude: 151.20, zoom: 4.0)

        gmapView = GMSMapView.map(withFrame: CGRect(x: 0, y: 0, width: width, height: height), camera: camera)
        gmapView.delegate = self

        self.loadTheme()
        
        // show current location on map
        gmapView.isMyLocationEnabled = true

        // allows gestures to go up to parent
        gmapView.settings.consumesGesturesInView = true
        
        // init all props
        self.updateLocations()
        self.updateMapLocation()

        self.view.addSubview(gmapView)
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
