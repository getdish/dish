import SwiftUI
import GoogleMaps
import GooglePlaces
import CoreLocation
import Combine
import Mapbox

class DishMapViewStore: ObservableObject {
    var cancels: Set<AnyCancellable> = []
    @Published var position: CurrentMapPosition? = nil
}

fileprivate let mapViewStore = DishMapViewStore()

struct DishMapView: View {
    @State var mapView: MapViewController? = nil
    
    @Environment(\.colorScheme) var colorScheme
    @Environment(\.geometry) var appGeometry
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var homeState: HomeViewState
    @EnvironmentObject var keyboard: Keyboard
    
    var appWidth: CGFloat { appGeometry?.size.width ?? Screen.width }
    var appHeight: CGFloat { appGeometry?.size.height ?? Screen.height }
    
    var maxPadHeight: CGFloat {
        appHeight - homeState.mapMinHeight
    }
    
    var height: CGFloat {
        appHeight + Screen.height / 2
    }
    
    var padHeight: CGFloat {
        (height - homeState.mapHeight) / 2
    }
    
    @State var padding: UIEdgeInsets = .init(top: 100, left: 0, bottom: 100, right: 0)

    var animate: Bool {
        return [.idle].contains(homeState.dragState)
            || homeState.animationState != .idle
            || self.homeState.mapHeight > self.homeState.startSnapToBottomAt
    }
    
    @State var annotations: [MGLPointAnnotation] = [
        MGLPointAnnotation(title: "Mapbox", coordinate: .init(latitude: 37.791434, longitude: -122.396267))
    ]
    
    var body: some View {
        ZStack(alignment: .topLeading) {
            // start
            Color.clear.onAppear { self.start() }
            
            VStack {
                ZStack(alignment: .topLeading) {
                    ZStack {
                        Group {
                            if true {
                                MapBoxView(annotations: self.$annotations)
                                    .styleURL(
                                        colorScheme == .dark
                                            ? URL(string: "mapbox://styles/nwienert/ck68dg2go01jb1it5j2xfsaja/draft")!
                                            : URL(string: "mapbox://styles/nwienert/ck675hkw702mt1ikstagge6yq/draft")!
                                        
                                    )
                                    .centerCoordinate(.init(latitude: 37.791329, longitude: -122.396906))
                                    .zoomLevel(10)
                                    .frame(height: Screen.fullHeight * 2)
                            } else {
                                MapView(
                                    width: appWidth,
                                    height: height,
                                    padding: self.padding,
                                    darkMode: self.colorScheme == .dark,
                                    animate: self.animate,
                                    moveToLocation: store.state.map.moveToLocation,
                                    locations: store.state.home.viewStates.last!.searchResults.results.map { $0.place },
                                    onMapSettle: { position in
                                        mapViewStore.position = position
                                }
                                )
                                    .introspectMapView { mapView in
                                        self.mapView = mapView
                                }
                            }
                        }
                        .animation(.spring())
                        .offset(y: -self.padHeight + 25 /* topbar offset */)
                    }
                    .frame(height: appHeight)
                    .clipped()
                    
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
                    
                    if self.homeState.isNearTop {
                        HStack {
                            CustomButton(action: {
                                self.mapView?.zoomOut()
                            }) {
                                MapButton(icon: "minus.magnifyingglass")
                            }
                            .frame(height: homeState.mapHeight)
                            Spacer()
                            CustomButton(action: {
                                self.mapView?.zoomIn()
                            }) {
                                MapButton(icon: "plus.magnifyingglass")
                            }
                            .frame(height: homeState.mapHeight)
                        }
                        .frame(height: homeState.mapHeight)
                        .animation(.spring())
                    }
                }
                .frame(height: appHeight)
                .shadow(color: Color.black, radius: 20, x: 0, y: 0)
                .clipped()
                
                Spacer()
            }
        }
    }
    
    func start() {
        // sync map location to state
        mapViewStore.$position
            .debounce(for: .milliseconds(200), scheduler: App.queueMain)
            .sink { position in
                if let position = position {
                    App.store.send(
                        .map(.setLocation(
                            MapLocationState(
                                radius: position.radius,
                                latitude: position.center.latitude,
                                longitude: position.center.longitude
                            )
                            ))
                    )
                }
        }
        .store(in: &mapViewStore.cancels)
        
        // mapHeight => zoom level
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
            //        .background(
            //            LinearGradient(
            //                gradient: Gradient(colors: [
            //                    Color.white.opacity(0),
            //                    Color.white.opacity(0.4)
            //                ]),
            //                startPoint: .top,
            //                endPoint: .bottom
            //            )
            //            .scaledToFill()
            //        )
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

struct DishMapControls: View {
    var body: some View {
        VStack {
            HStack {
                Spacer()
                VStack(spacing: 0) {
                    Button(action: {}) { Image(systemName: "plus.magnifyingglass") }
                        .buttonStyle(MapButtonStyle())
                        .cornerRadius(5, antialiased: true, corners: [.topLeft, .topRight])
                        .shadow(color: Color.black.opacity(0.25), radius: 4, y: 2)
                    Button(action: {}) { Image(systemName: "minus.magnifyingglass") }
                        .buttonStyle(MapButtonStyle())
                        .cornerRadius(5, antialiased: true, corners: [.bottomLeft, .bottomRight])
                        .shadow(color: Color.black.opacity(0.25), radius: 4, y: 2)
                }
            }
            .padding()
            .padding(.top, Screen.statusBarHeight)
        }
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
