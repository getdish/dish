import SwiftUI
import CoreLocation
import Combine
import Mapbox

struct DishMapView: View {
    @State var mapView: MapViewController? = nil
    
    @Environment(\.colorScheme) var colorScheme
    @Environment(\.geometry) var appGeometry
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var keyboard: Keyboard
    
    var appWidth: CGFloat { appGeometry?.size.width ?? App.screen.width }
    var appHeight: CGFloat { appGeometry?.size.height ?? App.screen.height }
    
    @State var padding: UIEdgeInsets = .init(top: 100, left: 0, bottom: 100, right: 0)

    var height: CGFloat = 100
    var animate: Bool = false

    var annotations: [MKPointAnnotation] {
        let results = Selectors.home.lastState().searchResults.results
        return results.map { result in
            let annotation = MKPointAnnotation()
            annotation.title =  result.name
            annotation.coordinate = result.coordinate
            return annotation
        }
    }
    
    func start() {
        self.syncMapLocationToState()
        self.syncMapHeightToZoomLevel()
    }
    
    var body: some View {
        ZStack(alignment: .topLeading) {
            Group {
                RunOnce(name: "start map") {
                    self.start()
                }
            }
            
            VStack {
                ZStack(alignment: .topLeading) {
                    ZStack {
                        Group {
                            if self.store.state.debugShowMap == 1 {
                                Spacer()
//                                MapBoxView(annotations: self.annotations)
//                                    .styleURL(
//                                        colorScheme == .dark
//                                            ? URL(string: "mapbox://styles/nwienert/ck68dg2go01jb1it5j2xfsaja/draft")!
//                                            : URL(string: "mapbox://styles/nwienert/ck675hkw702mt1ikstagge6yq/draft")!
//
//                                )
//                                    .centerCoordinate(.init(latitude: 37.791329, longitude: -122.396906))
//                                    .zoomLevel(11)
//                                    .frame(height: App.screen.height * 1.6)
                            } else if self.store.state.debugShowMap == 2 {
                                Spacer()
//                                MapView(
//                                    width: appWidth,
//                                    height: self.height,
//                                    padding: self.padding,
//                                    darkMode: self.colorScheme == .dark,
//                                    animate: self.animate,
//                                    moveToLocation: store.state.map.moveToLocation,
//                                    locations: [], //store.state.home.viewStates.last!.searchResults.results.map { $0.place },
//                                    onMapSettle: { position in
//                                        mapViewStore.position = position
//                                    }
//                                )
//                                    .introspectMapView { mapView in
//                                        self.mapView = mapView
//                                }
                            } else {
                                AppleMapView(
                                    annotations: self.annotations,
                                    currentLocation: store.state.map.moveToLocation,
                                    onChangeLocation: { location in
                                        if location != mapViewStore.location {
                                            mapViewStore.location = location
                                        }
                                    }
                                )
                                    .frame(height: App.screen.height * 1.6)
                            }
                        }
                    }
                    
                    // prevent touch on left/right sides for dragging between cards
                    HStack {
                        Color.black.opacity(0.00001).frame(width: 24)
                        Color.clear
                        Color.black.opacity(0.00001).frame(width: 24)
                    }
                    
                    // keyboard dismiss (above map, below content)
                    if self.keyboard.state.height > 0 {
                        Color.black.opacity(0.2)
                            .transition(.opacity)
                            .onTapGesture {
                                self.keyboard.hide()
                        }
                    }
                }
                
                Spacer()
            }
        }
    }
    
    func syncMapLocationToState() {
        mapViewStore.$location
            .debounce(for: .milliseconds(500), scheduler: App.queueMain)
            .sink { location in
                guard let location = location else { return }
                print("set to \(location)")
                App.store.send(.map(.setLocation(location)))
            }
            .store(in: &mapViewStore.cancels)
    }
    
    func syncMapHeightToZoomLevel() {
        if App.enableMapAutoZoom {
            var lastZoomAt = homeViewState.mapHeight
            
            homeViewState.$y
                .map { _ in homeViewState.mapHeight }
                .throttle(for: .milliseconds(50), scheduler: App.queueMain, latest: true)
                .removeDuplicates()
                .dropFirst()
                .sink { mapHeight in
                    if homeViewState.isAboutToSnap || homeViewState.isSnappedToBottom {
                        return
                    }
                    let amt = ((mapHeight - lastZoomAt) / homeViewState.mapMaxHeight) * 0.5
                    if amt == 0.0 {
                        return
                    }
                    lastZoomAt = mapHeight
                    self.mapView?.zoomIn(amt)
            }
            .store(in: &mapViewStore.cancels)
            
            // snappedToBottom => zoom
            homeViewState.$y
                .debounce(for: .milliseconds(50), scheduler: App.queueMain)
                .map { _ in homeViewState.isSnappedToBottom }
                .removeDuplicates()
                .dropFirst()
                //            .throttle(for: .milliseconds(50), scheduler: App.queueMain, latest: true)
                .sink { isSnappedToBottom in
                    if isSnappedToBottom {
                        self.mapView?.zoomIn(0.05)
                    } else {
                        self.mapView?.zoomOut(0.05)
                    }
            }
            .store(in: &mapViewStore.cancels)
        }
    }
}

struct MapButton: View {
    let icon: String
    
    var body: some View {
        let cornerRadius: CGFloat = 8
        return ZStack {
            Group {
                Image(systemName: icon)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 20, height: 20)
            }
            .foregroundColor(.white)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 40)
            .background(
                RadialGradient(
                    gradient: Gradient(colors: [
                        Color.white.opacity(0),
                        Color.white.opacity(0.8)
                    ]),
                    center: .center,
                    startRadius: 0,
                    endRadius: 80
                )
                    .scaledToFill()
        )
            .frame(width: 58)
            .cornerRadius(cornerRadius)
            .animation(.spring(response: 0.5))
            .shadow(color: Color.black.opacity(0.3), radius: 8, x: 0, y: 0)
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .stroke(Color.white.opacity(0.5), lineWidth: 1)
        )
            .overlay(
                VStack {
                    RoundedRectangle(cornerRadius: cornerRadius)
                        .stroke(Color.black.opacity(0.1), lineWidth: 1)
                }
                .padding(1)
        )
    }
}

struct MapButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .padding(.vertical, 12)
            .padding(.horizontal, 4)
            .background(Color(.tertiarySystemBackground))
    }
}

#if DEBUG
struct DishMapView_Previews: PreviewProvider {
    static var previews: some View {
        DishMapView()
            .embedInAppEnvironment()
    }
}
#endif

// keep this here for now, no need to split it into own file until we need to

class DishMapViewStore: ObservableObject {
    var cancels: Set<AnyCancellable> = []
    @Published var location: MapViewLocation? = nil
}

fileprivate let mapViewStore = DishMapViewStore()

// MARK -- Apple MapView

import MapKit
import CoreLocation

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

struct AppleMapView: UIViewRepresentable {
    private let mapView = MKMapView()
    var annotations: [MKPointAnnotation]? = nil
    var currentLocation: MapViewLocation? = nil
    var onChangeLocation: ((MapViewLocation) -> Void)? = nil
    
    func makeUIView(context: Context) -> MKMapView {
        mapView.delegate = context.coordinator
        return mapView
    }
    
    func updateUIView(_ uiView: MKMapView, context: Context) {
        let crd = context.coordinator
        crd.updateCurrentLocation(self.currentLocation)
        crd.updateAnnotations(self.annotations)
    }
    
    func makeCoordinator() -> AppleMapView.Coordinator {
        Coordinator(self)
    }
    
    final class Coordinator: NSObject, MKMapViewDelegate {
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
            let annotationIdentifier = "MyCustomAnnotation"
            guard !annotation.isKind(of: MKUserLocation.self) else {
                return nil
            }

            var annotationView = mapView.dequeueReusableAnnotationView(withIdentifier: annotationIdentifier)
            if annotationView == nil {
//                annotationView = MKPinAnnotationView(annotation: annotation, reuseIdentifier: "marker")
                annotationView = MKMarkerAnnotationView(annotation: annotation, reuseIdentifier: "marker")
                if case let annotationView as MKMarkerAnnotationView = annotationView {
                    annotationView.annotation = annotation
                    annotationView.isEnabled = true
                    annotationView.canShowCallout = true
                    annotationView.animatesWhenAdded = true
                    annotationView.glyphImage = UIImage(named: "pin")
                }
                
//                annotationView = CustomAnnotationView(annotation: annotation, reuseIdentifier: annotationIdentifier)
//                if case let annotationView as CustomAnnotationView = annotationView {
//                    annotationView.isEnabled = true
//                    annotationView.canShowCallout = true
//                    annotationView.label = UILabel(frame: CGRect(x: 5.5, y: 11.0, width: 90.0, height: 30.0))
//                    if let label = annotationView.label {
//                        label.font = UIFont(name: "HelveticaNeue", size: 22.0)
//                        label.textAlignment = .left
//                        label.textColor = UIColor(white: 0, alpha: 1)
//                        label.adjustsFontSizeToFitWidth = true
//                        annotationView.addSubview(label)
//                    }
//                }
            }

//            if case let annotationView as CustomAnnotationView = annotationView {
//                annotationView.annotation = annotation
//                annotationView.image = UIImage(named: "pin")
//                if let title = annotation.title,
//                    let label = annotationView.label {
//                    label.text = title
//                }
//            }

            return annotationView
        }
        
        func updateAnnotations(_ annotations: [MKPointAnnotation]?) {
            guard let annotations = annotations else { return }
            mapView.addAnnotations(annotations)
//            let annotation = MKPointAnnotation()
//            annotation.coordinate = CLLocationCoordinate2D(latitude: /* latitude */, longitude: /* longitude */)
//            annotation.title = "Your Pin Title"
//            mapView.addAnnotation(annotation)
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
