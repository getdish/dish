import SwiftUI
import MapKit
import CoreLocation

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
    
    init(center: LocationType, radius: Double = 10000, refresh: Bool = false) {
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

fileprivate var flagMap = [String: UIImage]()

struct AppleMapView: UIViewRepresentable {
    private let mapView = MKMapView()
    var markers: [MapMarker]? = nil
    var currentLocation: MapViewLocation? = nil
    var onChangeLocation: ((MapViewLocation) -> Void)? = nil
    
    func makeUIView(context: Context) -> MKMapView {
        mapView.delegate = context.coordinator
        return mapView
    }
    
    func updateUIView(_ uiView: MKMapView, context: Context) {
        let crd = context.coordinator
        crd.updateCurrentLocation(self.currentLocation)
        crd.updateMarkers(self.markers)
    }
    
    func makeCoordinator() -> AppleMapView.Coordinator {
        Coordinator(self)
    }
    
    final class Coordinator: NSObject, MKMapViewDelegate {
        var lastMarkers: [MapMarker] = []
        var lastLocation: MapViewLocation = .init(center: .none)
        var locationManager = CLLocationManager()
        var parent: AppleMapView
        
        init(_ parent: AppleMapView) {
            self.parent = parent
        }
        
        var mapView: MKMapView {
            parent.mapView
        }
        
        func mapView(_ mapView: MKMapView, regionDidChangeAnimated animated: Bool) {
            if let cb = parent.onChangeLocation {
                cb(MapViewLocation(
                    center: .location(lat: mapView.centerCoordinate.latitude, long: mapView.centerCoordinate.longitude),
                    // why * x? - idk but its not matching, may be related to that we make map view 1.6x taller than screen?
                    radius: mapView.currentRadius() * 0.575
                ))
            }
        }
        
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
                        if let text = annotation.title??.replacingOccurrences(of: "flag-", with: "") {
                            let flagImage = text.image()
                            annotationView.image = flagImage
                            flagMap[annotation.title!!] = flagImage
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
                if let index = flagMap.firstIndex(where: { $0.key == annotation.title }) {
                    annotationView.image = flagMap[index].value
                }
            }
            
            return annotationView
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
            if marker.countryIcon != "" {
                mapView.addAnnotation(createFlagAnnotation(marker))
            }
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
        
        func updateCurrentLocation(_ location: MapViewLocation?) {
            guard let location = location else {
                return
            }
            if self.lastLocation == location {
                return
            }
            self.lastLocation = location
            switch location.center {
                case .current:
                    if let coordinate = locationManager.location?.coordinate {
                        let coordinateRegion = MKCoordinateRegion(
                            center: coordinate,
                            latitudinalMeters: location.radius,
                            longitudinalMeters: location.radius
                        )
                        mapView.setRegion(coordinateRegion, animated: true)
                }
                case .location(lat: let lat, long: let long):
                    print("todo")
                case .none:
                    print("todo")
            }
        }
    }
}
