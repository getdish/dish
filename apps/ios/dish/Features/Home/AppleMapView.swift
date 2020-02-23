import SwiftUI
import MapKit
import CoreLocation

fileprivate var flagMap = [String: UIImage]()

struct AppleMapView: UIViewRepresentable {
    private let mapView = MKMapView()
    
    // props
    var currentLocation: MapViewLocation? = nil
    var markers: [MapMarker]? = nil
    @Binding var mapZoom: Double
    var onChangeLocation: ((MapViewLocation) -> Void)? = nil
    var onChangeLocationName: ((CLPlacemark) -> Void)? = nil
    var showsUserLocation: Bool = false
    
    func makeUIView(context: Context) -> MKMapView {
        mapView.delegate = context.coordinator
        self.update(context.coordinator)
        return mapView
    }
    
    func updateUIView(_ uiView: MKMapView, context: Context) {
        self.update(context.coordinator)
    }
    
    func update(_ coordinator: AppleMapView.Coordinator) {
        coordinator.updateProps(self)
    }
    
    func makeCoordinator() -> AppleMapView.Coordinator {
        Coordinator(self)
    }
    
    final class Coordinator: NSObject, MKMapViewDelegate {
        let geocoder = CLGeocoder()
        var currentLocation: CLLocation? = nil
        var lastGeocodeTime: Date? = nil
        var lastMarkers: [MapMarker] = []
        var lastLocation: MapViewLocation = .init(center: .none)
        var locationManager = CLLocationManager()
        var parent: AppleMapView
        var zoomingIn = false
        var zoomingAnnotation: MKAnnotation? = nil
        var mapZoom: Double
        
        init(_ parent: AppleMapView) {
            self.parent = parent
            self.mapZoom = parent.mapView.zoomLevel()
        }
        
        func mapViewDidFinishLoadingMap(_ mapView: MKMapView) {
            self.updateProps(self.parent)
        }
        
        var mapView: MKMapView {
            parent.mapView
        }
        
        // on select annotation
        func mapView(_ mapView: MKMapView, didSelect view: MKAnnotationView) {
            print("selected annotation \(view)")
//            zoomToAnnotation(view.annotation!)
        }
        
        // change location
        func mapView(_ mapView: MKMapView, regionDidChangeAnimated animated: Bool) {
            if let cb = parent.onChangeLocation {
                let location = MapViewLocation(
                    center: .location(lat: mapView.centerCoordinate.latitude, long: mapView.centerCoordinate.longitude),
                    // why * x? - idk but its not matching, may be related to that we make map view 1.6x taller than screen?
                    radius: mapView.currentRadius() * 0.575
                )
                cb(location)
            }
        }
        
        // annotations
        func mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView? {
            guard !annotation.isKind(of: MKUserLocation.self) else {
                return nil
            }
            var annotationView = mapView.dequeueReusableAnnotationView(withIdentifier: "MyCustomAnnotation")
            
            if annotationView == nil {
                if annotation.title??.hasPrefix("flag-") == true {
                    annotationView = CustomAnnotationView(annotation: annotation, reuseIdentifier: "flag")
                    if case let annotationView as CustomAnnotationView = annotationView {
                        annotationView.annotation = annotation
                        annotationView.centerOffset = CGPoint(x: 10, y: -25)
                        annotationView.layer.zPosition = 10
//                        annotationView.animatesDrop = true
                        annotationView.displayPriority = .required
                        if App.enableMapFlags == true {
                            if let text = annotation.title??.replacingOccurrences(of: "flag-", with: "") {
                                let flagImage = text.image()
                                annotationView.image = flagImage
                                flagMap[annotation.title!!] = flagImage
                            }
                        }
                    }
                } else {
                    annotationView = MKMarkerAnnotationView(annotation: annotation, reuseIdentifier: "marker")
                    if case let annotationView as MKMarkerAnnotationView = annotationView,
                        let marker = self.lastMarkers.first(where: { $0.coordinate == annotation.coordinate }) {
                        annotationView.annotation = annotation
                        annotationView.layer.zPosition = 0
                        annotationView.isEnabled = true
                        annotationView.canShowCallout = true
                        annotationView.animatesWhenAdded = false
                        annotationView.glyphImage = UIImage(named: marker.imageName)
                        annotationView.markerTintColor = marker.color
                        annotationView.clusteringIdentifier = marker.groupId
                        annotationView.displayPriority = .required
                    }
                }
            }
            
            if let annotationView = annotationView {
                annotationView.displayPriority = .required
                if App.enableMapFlags == true {
                    if let index = flagMap.firstIndex(where: { $0.key == annotation.title }) {
                        annotationView.image = flagMap[index].value
                    }
                }
            }
            
            return annotationView
        }
        
        // user location
        func mapView(_ mapView: MKMapView, didUpdate userLocation: MKUserLocation) {
            guard let newLocation = userLocation.location else { return }
            
            let currentTime = Date()
            let lastLocation = self.currentLocation
            self.currentLocation = newLocation
            
            // Only get new placemark information if you don't have a previous location,
            // if the user has moved a meaningful distance from the previous location, such as 1000 meters,
            // and if it's been 60 seconds since the last geocode request.
            if let lastLocation = lastLocation,
                newLocation.distance(from: lastLocation) <= 1000,
                let lastTime = lastGeocodeTime,
                currentTime.timeIntervalSince(lastTime) < 60 {
                return
            }
            
            // Convert the user's location to a user-friendly place name by reverse geocoding the location.
            lastGeocodeTime = currentTime
            geocoder.reverseGeocodeLocation(newLocation) { (placemarks, error) in
                guard error == nil else {
                    print("ERROR in location \(error)")
                    return
                }
                
                // Most geocoding requests contain only one result.
                if let firstPlacemark = placemarks?.first,
                    let cb = self.parent.onChangeLocationName {
                    cb(firstPlacemark)
                }
            }
        }
        
        func zoomToAnnotation(_ annotation: MKAnnotation) {
            let zoomOutRegion = MKCoordinateRegion(
                center: mapView.region.center,
                span: MKCoordinateSpan(latitudeDelta: 0.09, longitudeDelta: 0.09)
            )
            zoomingIn = true
            zoomingAnnotation = annotation
            mapView.setRegion(zoomOutRegion, animated: true)
        }
        
        func updateProps(_ parent: AppleMapView) {
            if self.mapView.bounds.width == 0 || self.mapView.bounds.height == 0 {
                print("map not loaded yet or not visible")
                return
            }
            
            self.updateCurrentLocation(parent.currentLocation)
            self.updateMarkers(parent.markers)
            self.mapView.showsUserLocation = parent.showsUserLocation
            if parent.mapZoom != self.mapZoom {
                print("AppleMapView setting zoom level to \(parent.mapZoom) from \(self.mapZoom)")
                self.mapZoom = parent.mapZoom
                let center = self.getCurrentCenter() ?? mapView.centerCoordinate
                self.mapView.setCenterCoordinate(
                    centerCoordinate: center,
                    zoomLevel: parent.mapZoom,
                    animated: true
                )
            }
        }
        
        func updateMarkers(_ markers: [MapMarker]?) {
            guard let markers = markers else { return }
            if markers.elementsEqual(lastMarkers) {
                return
            }
            lastMarkers.forEach { last in
                if !markers.contains(last) {
                    removeAnnotation(last)
                }
            }
            markers.forEach { next in
                if !lastMarkers.contains(next) {
                    addAnnotation(next)
                }
            }
            self.lastMarkers = markers
        }
        
        func removeAnnotation(_ marker: MapMarker) {
            mapView.removeAnnotation(createAnnotation(marker))
            if marker.countryIcon != "" {
                mapView.removeAnnotation(createFlagAnnotation(marker))
            }
        }
        
        func addAnnotation(_ marker: MapMarker) {
            mapView.addAnnotation(createAnnotation(marker))
            // disable showing country flags until we get time to polish
//            if marker.countryIcon != "" {
//                mapView.addAnnotation(createFlagAnnotation(marker))
//            }
        }
        
        func createAnnotation(_ marker: MapMarker) -> MKAnnotation {
            let annotation = MKPointAnnotation()
            annotation.coordinate = marker.coordinate
            annotation.title = marker.title
            return annotation
        }
        
        func createFlagAnnotation(_ marker: MapMarker) -> MKAnnotation {
            let annotation = MKPointAnnotation()
            annotation.coordinate = marker.coordinate
            annotation.title = "flag-\(marker.countryIcon)"
            return annotation
        }
        
        func getCurrentCenter(_ location: MapViewLocation? = nil) -> CLLocationCoordinate2D? {
            guard let location = location ?? self.parent.currentLocation else {
                return nil
            }
            switch location.center {
                case .current:
                    if let coordinate = locationManager.location?.coordinate {
                        return coordinate
                    }
                case .location(lat: let lat, long: let long):
                    return .init(latitude: lat, longitude: long)
                case .none:
                    return nil
            }
            return nil
        }
        
        func updateCurrentLocation(_ location: MapViewLocation?) {
            guard let location = location else {
                return
            }
            if self.lastLocation == location {
                return
            }
            self.lastLocation = location
            if let center = self.getCurrentCenter(location) {
                let coordinateRegion = MKCoordinateRegion(
                    center: center,
                    latitudinalMeters: mapView.currentRadius(),
                    longitudinalMeters: mapView.currentRadius()
                )
                mapView.setRegion(coordinateRegion, animated: true)
            }
        }
    }
}

struct MapMarker: Equatable {
    let groupId: String = ""
    let title: String
    let subtitle: String? = nil
    let coordinate: CLLocationCoordinate2D
    let color: UIColor = .gray
    let imageName: String = "pin"
    let countryIcon: String = "🇲🇽"
}

struct MapViewLocation: Equatable {
    enum LocationType: Equatable {
        case current
        case location(lat: Double, long: Double)
        case none
        
    }
    
    static let timeless = NSDate()
    let center: LocationType
    let radius: Double
    let updatedAt: NSDate
    
    init(center: LocationType, radius: Double = 1000, refresh: Bool = false) {
        self.center = center
        self.radius = radius
        self.updatedAt = refresh ? NSDate() : MapViewLocation.timeless
    }
    
    var coordinate: CLLocationCoordinate2D? {
        switch center {
            case .current: return nil
            case .none: return nil
            case .location(let lat, let long):
                return CLLocationCoordinate2D(latitude: lat, longitude: long)
        }
    }
}

extension MKMapView {
    func topCenterCoordinate() -> CLLocationCoordinate2D {
        return self.convert(CGPoint(x: self.frame.size.width / 2.0, y: 0), toCoordinateFrom: self)
    }
    func currentRadius() -> Double {
        let centerLocation = CLLocation(latitude: self.centerCoordinate.latitude, longitude: self.centerCoordinate.longitude)
        let topCenterCoordinate = self.topCenterCoordinate()
        let topCenterLocation = CLLocation(latitude: topCenterCoordinate.latitude, longitude: topCenterCoordinate.longitude)
        return centerLocation.distance(from: topCenterLocation)
    }
}

class CustomAnnotationView: MKAnnotationView {
    var label: UILabel?
    
    override init(annotation: MKAnnotation?, reuseIdentifier: String?) {
        super.init(annotation: annotation, reuseIdentifier: reuseIdentifier)
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
}

extension CLLocationCoordinate2D: Equatable {
    public static func == (lhs: CLLocationCoordinate2D, rhs: CLLocationCoordinate2D) -> Bool {
        lhs.latitude == rhs.latitude && lhs.longitude == rhs.longitude
    }
}
