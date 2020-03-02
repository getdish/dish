import CoreLocation
import MapKit
import SwiftUI

fileprivate var flagMap = [String: UIImage]()

struct AppleMapView: UIViewRepresentable {
  private let mapView = MKMapView()

  // props
  var animated: Bool = true

  var currentLocation: MapViewLocation? = nil
  var markers: [MapMarker]? = nil
  @Binding var mapZoom: Double
  var onChangeLocation: ((MapViewLocation) -> Void)? = nil
  var onChangeLocationName: ((CLPlacemark) -> Void)? = nil
  var onChangeUserLocation: ((CLLocation, CLPlacemark) -> Void)? = nil
  var onSelectMarkers: (([MapMarker]) -> Void)? = nil
  var showsUserLocation: Bool = false

  func makeUIView(context: Context) -> MKMapView {
    mapView.delegate = context.coordinator
    context.coordinator.updateProps(self)
    return mapView
  }

  func updateUIView(_ uiView: MKMapView, context: Context) {
    context.coordinator.updateProps(self)
  }

  func makeCoordinator() -> AppleMapView.Coordinator {
    Coordinator(self)
  }

  final class Coordinator: NSObject, MKMapViewDelegate {
    let geocoder = CLGeocoder()
    var currentLocation: CLLocation? = nil
    var lastGeocodeTime: Date? = nil
    var lastLocation: MapViewLocation = .init(center: .none)
    var lastMapLocation: MapViewLocation = .init(center: .none)
    var lastUserLocation: CLLocation = .init()
    var locationManager = CLLocationManager()
    var current: AppleMapView
    var zoomingIn = false
    var zoomingAnnotation: MKAnnotation? = nil

    init(_ parent: AppleMapView) {
      self.current = parent
    }
    
    var mapView: MKMapView {
      current.mapView
    }
    
    func updateProps(_ next: AppleMapView) {
      self.mapView.showsUserLocation = next.showsUserLocation
      self.mapView.userLocation.title = nil

      // map not loaded yet
      if self.mapView.bounds.width == 0 || self.mapView.bounds.height == 0 {
        self.current = next
        return
      }

      // do updates before updating next
      self.updateMarkers(next.markers)
      self.updateCurrentLocation(next)
    }

    func mapViewDidFinishLoadingMap(_ mapView: MKMapView) {
      self.updateProps(self.current)
      self.callbackOnChangeLocationName()
    }

    // on select annotation
    func mapView(_ mapView: MKMapView, didSelect view: MKAnnotationView) {
      if let cluster = view.annotation as? MKClusterAnnotation {
        let arrayList = cluster.memberAnnotations
        print("tapped cluster \(arrayList)")

        let markers: [MapMarker] = arrayList.compactMap { annotation in
          current.markers?.first { $0.title == annotation.title }
        }
        if let cb = current.onSelectMarkers { cb(markers) }

        // If you want the map to display the cluster members
        mapView.showAnnotations(cluster.memberAnnotations, animated: true)

      }

      //            zoomToAnnotation(view.annotation!)
    }

    // change region
    func mapView(_ mapView: MKMapView, regionDidChangeAnimated animated: Bool) {
      if let cb = current.onChangeLocation {
        let location = MapViewLocation(
          center: .location(
            lat: mapView.centerCoordinate.latitude, long: mapView.centerCoordinate.longitude),
          // why * x? - idk but its not matching, may be related to that we make map view 1.6x taller than screen?
          radius: mapView.currentRadius() * 0.575
        )
        if location != self.lastLocation {
          self.lastLocation = location
          cb(location)
        }
      }
      
      self.callbackOnChangeLocationName()
    }
    
    func callbackOnChangeLocationName() {
      if let cb = self.current.onChangeLocationName {
        // Convert the user's location to a user-friendly place name by reverse geocoding the location.
        geocoder.reverseGeocodeLocation(
          .init(
            latitude: mapView.centerCoordinate.latitude,
            longitude: mapView.centerCoordinate.longitude
          )
        ) { (placemarks, error) in
          guard error == nil else { return }
          if let firstPlacemark = placemarks?.first {
            cb(firstPlacemark)
          }
        }
      }
    }

    // annotations
    func mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView? {
      guard !annotation.isKind(of: MKUserLocation.self) else {
        return nil
      }
      var annotationView = mapView.dequeueReusableAnnotationView(
        withIdentifier: "MyCustomAnnotation")

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
            let marker = self.current.markers?.first(where: { $0.coordinate == annotation.coordinate })
          {
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

    // cahnge user location
    func mapView(_ mapView: MKMapView, didUpdate userLocation: MKUserLocation) {
      guard let newLocation = userLocation.location else { return }

      // if the user has moved a meaningful distance from the previous location
      if newLocation.distance(from: self.lastUserLocation) < 10 {
        return
      }
      
      self.lastUserLocation = newLocation
      
      
      if let cb = self.current.onChangeUserLocation {
        geocoder.reverseGeocodeLocation(newLocation) { (placemarks, error) in
          guard error == nil else { return }
          if let firstPlacemark = placemarks?.first {
            cb(newLocation, firstPlacemark)
          }
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

    func updateMarkers(_ next: [MapMarker]?) {
      if let next = next,
        let cur = current.markers {
        if next.elementsEqual(cur) { return }
        cur.forEach { last in
          if !next.contains(last) {
            removeAnnotation(last)
          }
        }
        next.forEach { next in
          if !cur.contains(next) {
            addAnnotation(next)
          }
        }
      }
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
      guard let location = location ?? self.current.currentLocation else {
        return nil
      }
      switch location.center {
      case .current:
        if let coordinate = locationManager.location?.coordinate {
          return coordinate
        }
      case .location(let lat, let long):
        return .init(latitude: lat, longitude: long)
      case .none:
        return nil
      }
      return nil
    }

    func updateCurrentLocation(_ next: AppleMapView) {
      if current.currentLocation == next.currentLocation
        && current.mapZoom == next.mapZoom
        && current.animated == next.animated {
        return
      }
      self.mapView.setCenterCoordinate(
        centerCoordinate: self.getCurrentCenter() ?? mapView.centerCoordinate,
        zoomLevel: next.mapZoom,
        animated: next.animated
      )
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
    let centerLocation = CLLocation(
      latitude: self.centerCoordinate.latitude, longitude: self.centerCoordinate.longitude)
    let topCenterCoordinate = self.topCenterCoordinate()
    let topCenterLocation = CLLocation(
      latitude: topCenterCoordinate.latitude, longitude: topCenterCoordinate.longitude)
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
