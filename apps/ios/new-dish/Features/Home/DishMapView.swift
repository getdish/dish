import SwiftUI
import GoogleMaps
import GooglePlaces
import CoreLocation
import Combine

var cancels: Set<AnyCancellable> = []

class DishMapViewStore: ObservableObject {
    @Published var position: CurrentMapPosition? = nil
}

struct DishMapView: View {
    var mapViewStore = DishMapViewStore()
    @State var mapView: MapViewController? = nil
    
    @Environment(\.colorScheme) var colorScheme
    @Environment(\.geometry) var appGeometry
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var homeState: HomeViewState
    
    private var keyboard = Keyboard()
    
    var appWidth: CGFloat { appGeometry?.size.width ?? Screen.width }
    var appHeight: CGFloat { appGeometry?.size.height ?? Screen.height }
    
    var hiddenHeight: CGFloat {
        let visibleHeight = homeState.mapHeight - (homeState.isSnappedToBottom ? cardRowHeight : 0)
        return appHeight  - visibleHeight
    }
    
    @State var padding: UIEdgeInsets = .init(top: 0, left: 0, bottom: 0, right: 0)
    
    func start() {
        // sync map location to state
        self.mapViewStore.$position
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
        .store(in: &cancels)

        // mapHeight => zoom level
        var lastZoomAt = homeViewState.mapHeight
        homeViewState.$y
            .map { _ in homeViewState.mapHeight }
            .throttle(for: .milliseconds(50), scheduler: App.queueMain, latest: true)
            .sink { mapHeight in
                let amt = -((mapHeight - lastZoomAt) / homeViewState.mapMaxHeight) / 3
                print("amt \(amt)")
                if amt != 0.0 {
                    lastZoomAt = mapHeight
                    self.mapView?.zoomIn(amt)
                }
        }
        .store(in: &cancels)

        // mapHeight => padding
        homeViewState.$y
            .map { _ in homeViewState.mapHeight }
            .throttle(for: .milliseconds(50), scheduler: App.queueMain, latest: true)
            .sink { mapHeight in
                self.padding = .init(top: 0, left: 0, bottom: self.hiddenHeight, right: 0)
        }
        .store(in: &cancels)
    }
    
    var body: some View {
        let hideEdge: CGFloat = 200

        return ZStack {
            Color.clear.onAppear { self.start() }
            
            VStack {
            ZStack {
                MapView(
                    width: appWidth,
                    height: appHeight + hideEdge,
                    padding: self.padding,
                    darkMode: self.colorScheme == .dark,
                    animate: [.idle].contains(homeState.dragState) || homeState.animationState != .idle || self.homeState.y > self.homeState.aboutToSnapToBottomAt,
                    moveToLocation: store.state.map.moveToLocation,
                    locations: store.state.home.state.last!.searchResults.results.map { $0.place },
                    onMapSettle: { position in
                        self.mapViewStore.position = position
                    }
                )
                .introspectMapView { mapView in
                    self.mapView = mapView
                }
                .offset(y: -hideEdge / 2)
                
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
                        CustomButton({
                            self.mapView?.zoomIn()
                        }) {
                            MapButton(icon: "minus.magnifyingglass")
                        }
                        .frame(height: homeState.mapHeight)
                        Spacer()
                        CustomButton({
                            self.mapView?.zoomOut()
                        }) {
                            MapButton(icon: "plus.magnifyingglass")
                        }
                        .frame(height: homeState.mapHeight)
                    }
                    .frame(height: homeState.mapHeight)
                    .animation(.spring())
                }
            }
            .frame(height: homeState.mapHeight)
            .cornerRadius(self.homeState.isNearTop ? 40 : 20)
            .scaleEffect(self.homeState.isNearTop ? 0.95 : 1)
            .shadow(color: Color.black, radius: 20, x: 0, y: 0)
            .clipped()
    //                        .animation(.spring(), value: state.animationState == .animate)
            .animation(.spring(response: 0.28))
            .offset(y: homeState.showCamera ? -Screen.height : 0)
            .rotationEffect(homeState.showCamera ? .degrees(-15) : .degrees(0))
            
            Spacer()
        }
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
