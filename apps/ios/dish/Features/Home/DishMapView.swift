import SwiftUI
import CoreLocation
import Combine
import Mapbox

class DishMapViewStore: ObservableObject {
    var cancels: Set<AnyCancellable> = []
    @Published var location: MapViewLocation? = nil
}

fileprivate let mapViewStore = DishMapViewStore()

// AppleMapView
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

struct AppleMapView: UIViewRepresentable {
    private let mapView = MKMapView()
    var currentLocation: MapViewLocation? = nil
    var onChangeLocation: ((MapViewLocation) -> Void)? = nil
    
    func makeUIView(context: Context) -> MKMapView {
        mapView.delegate = context.coordinator
        return mapView
    }
    
    func updateUIView(_ uiView: MKMapView, context: Context) {
        let crd = context.coordinator
        if crd.lastLocation != self.currentLocation {
            crd.setCurrentLocation(self.currentLocation)
        }
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
                    radius: mapView.currentRadius()
                ))
            }
        }
        
        func setCurrentLocation(_ location: MapViewLocation?) {
            guard let location = location else {
                return
            }
            if self.lastLocation != location {
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
}

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

    var annotations: [MGLPointAnnotation] {
        let results = Selectors.home.lastState().searchResults.results
        return results.map { result in
            MGLPointAnnotation(
                title: result.name,
                coordinate: result.coordinate
            )
        }
    }
    
    func start() {
        // mapHeight => zoom level
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
                                MapBoxView(annotations: self.annotations)
                                    .styleURL(
                                        colorScheme == .dark
                                            ? URL(string: "mapbox://styles/nwienert/ck68dg2go01jb1it5j2xfsaja/draft")!
                                            : URL(string: "mapbox://styles/nwienert/ck675hkw702mt1ikstagge6yq/draft")!
                                        
                                )
                                    .centerCoordinate(.init(latitude: 37.791329, longitude: -122.396906))
                                    .zoomLevel(11)
                                    .frame(height: App.screen.height * 1.6)
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
            .debounce(for: .milliseconds(200), scheduler: App.queueMain)
            .sink { location in
                guard let location = location else { return }
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

//                    if self.homeState.isNearTop {
//                        HStack {
//                            CustomButton(action: {
//                                self.mapView?.zoomOut()
//                            }) {
//                                MapButton(icon: "minus.magnifyingglass")
//                            }
//                            .frame(height: homeState.mapHeight)
//                            Spacer()
//                            CustomButton(action: {
//                                self.mapView?.zoomIn()
//                            }) {
//                                MapButton(icon: "plus.magnifyingglass")
//                            }
//                            .frame(height: homeState.mapHeight)
//                        }
//                        .frame(height: homeState.mapHeight)
//                        .animation(.spring())
//                    }
