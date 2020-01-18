import SwiftUI
import Combine
import GoogleMaps

// TODO this can be a generic view again in Views/
// just need to clean it up a little

fileprivate struct Constants {
    static let ONE_METER_TO_LAT: Double = 1 / 111111
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
    class MapViewStore {
        var introspectMapAction: ((MapViewController) -> Void)? = nil
        var controller: MapViewController? = nil
    }
    
    var width: CGFloat
    var height: CGFloat
    var hiddenBottomPct: CGFloat = 0
    var darkMode: Bool?
    var animate: Bool
    var moveToLocation: MapViewLocation?
    var locations: [GooglePlaceItem] = []
    var onMapSettle: OnChangeSettle?
    var state = MapViewStore()

    func makeCoordinator() -> MapView.Coordinator {
        Coordinator(self)
    }
    
    func introspectMapView(_ cb: @escaping ((MapViewController) -> Void)) -> Self {
        self.state.introspectMapAction = cb
        return self
    }

    func makeUIViewController(context: Context) -> UIViewController {
        let controller = MapViewController(
            width: width,
            height: height,
            hiddenBottomPct: hiddenBottomPct,
            moveToLocation: moveToLocation,
            locations: locations,
            darkMode: darkMode,
            animate: animate,
            onMapSettle: onMapSettle
        )
        self.state.controller = controller
        async {
            if let cb = self.state.introspectMapAction {
                cb(controller)
            }
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
            async {
                self.parent.state.controller?.update(parent)
            }
        }
    }
}

class MapViewController: UIViewController, GMSMapViewDelegate {
    // want to default to city level view
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
    var zoom: CGFloat = 12.0

    init(
        width: CGFloat,
        height: CGFloat,
        hiddenBottomPct: CGFloat = 0,
        moveToLocation: MapViewLocation?,
        locations: [GooglePlaceItem] = [],
        darkMode: Bool?,
        animate: Bool?,
        onMapSettle: OnChangeSettle? = nil
    ) {
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
        
        async(1000) {
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
        self.zoom = CGFloat(cameraPosition.zoom)
    }
    
    func radius() -> Double {
        gmapView.getRadius() * Double(1 - self.hiddenBottomPct)
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
            let next = getCurrentMapPosition()
            // only callback if we move above a threshold
            let shouldCallback = self.lastSettledAt == nil
                || self.lastSettledAt!.location.distance(from: next.location) > 1000
                || abs(abs(self.lastSettledAt!.radius) - abs(next.radius)) > 2000
            if shouldCallback {
                print(" 🗺 onMapSettle cb \(next)")
                cb(next)
            }
            self.lastSettledAt = next
        }
    }

    // on props update

    func update(_ parent: MapView) {
        // cancel any pending updates
        updateCancels.forEach { $0.cancel() }
        updateCancels = []
        
        var shouldUpdateCamera = false
        
        if self.animate != parent.animate {
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
            shouldUpdateCamera = true
            // update our bounds
            gmapView.padding = .init(
                top: 0,
                left: 0,
                // TODO its close but not perfect
                bottom: self.hiddenBottomPct * Screen.fullHeight + 23.5,
                right: 0
            )
            self.callbackOnSettle()
        }
        
        if shouldUpdateCamera {
            self.updateCamera()
        }
    }
    
    func zoomOut() {
        self.zoom = self.zoom * 1.3
        self.updateCamera()
    }
    
    func zoomIn() {
        self.zoom = self.zoom * 0.7
        self.updateCamera()
    }
    
    func updateLocations() {
        log.info("update locations \(self.locations.count)")
        self.gmapView.clear()
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

    func updateMapLocation() {
        guard let moveTo = self.moveToLocation else { return }
        print(" 🗺 updateMapLocation \(moveTo.at)")
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
            print(" 🗺 moveToCurrentLocation \(currentLocation.coordinate)")
            self.updateCamera(currentLocation.coordinate)
        } else {
            print(" 🗺 moveToCurrentLocation (waiting for current location...)")
            // wait for location once
            var updated = false
            self.currentLocationService.$lastLocation
                .drop(while: { $0 == nil })
                .sink { loc in
                    if !updated {
                        updated = true
                        async {
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
    
    var isAnimating = false
    var lastAnimation: AnyCancellable? = nil
    
    private func getCurrentMapPosition(_ coord: CLLocationCoordinate2D? = nil) -> CurrentMapPosition {
        let coordinate = coord ?? centerCoordinate
        return CurrentMapPosition(
            center: coordinate,
            location: CLLocation(latitude: coordinate.latitude, longitude: coordinate.longitude),
            radius: radius()
        )
    }

    private func updateCamera(_ coordinate: CLLocationCoordinate2D? = nil) {
        if let camera = getCamera(coordinate) {
            if let coord = coordinate {
                self.lastSettledAt = getCurrentMapPosition(coord)
            }
            if gmapView.isHidden {
                gmapView.isHidden = false
            }
            if self.animate {
                if let last = lastAnimation { last.cancel() }
                // to control animation duration... uncomment below
                self.isAnimating = true
                let seconds = 0.5
                CATransaction.begin()
                CATransaction.setValue(seconds, forKey: kCATransactionAnimationDuration)
                gmapView.animate(to: camera)
                CATransaction.commit()
                
                var cancelled = false
                lastAnimation = AnyCancellable { cancelled = true }
                async(seconds * 1000) {
                    if !cancelled {
                        self.isAnimating = false
                    }
                }
            } else {
                gmapView.camera = camera
            }
        }
    }

    private func getCamera(_ givenLoc: CLLocationCoordinate2D? = nil) -> GMSCameraPosition? {
        let location = givenLoc ?? self.lastSettledAt?.location.coordinate ?? gmapView.getCenterCoordinate()
        return GMSCameraPosition.camera(
            withLatitude: location.latitude,
            longitude: location.longitude,
            zoom: Float(self.zoom)
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
