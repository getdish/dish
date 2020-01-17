import SwiftUI
import GooglePlaces
import CoreLocation
import Combine

struct DishMapView: View {
    @Environment(\.colorScheme) var colorScheme
    @Environment(\.geometry) var appGeometry
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var homeState: HomeViewState
    
    private var service = DishMapViewService()
    private var keyboard = Keyboard()
    
    var body: some View {
        let appWidth: CGFloat = appGeometry?.size.width ?? Screen.width
        let appHeight: CGFloat = appGeometry?.size.height ?? Screen.height
        let visibleHeight = homeState.mapHeight - (homeState.isSnappedToBottom ? cardRowHeight : 0)
        let hiddenBottomPct: CGFloat = (appHeight - visibleHeight) / appHeight
        let zoom = homeState.mapHeight / 235 + 9.7

        return VStack {
            ZStack {
                ZStack {
                    MapView(
                        width: appWidth,
                        height: appHeight,
                        hiddenBottomPct: hiddenBottomPct,
                        zoom: zoom,
                        darkMode: self.colorScheme == .dark,
                        animate: [.idle].contains(homeState.dragState) || homeState.animationState != .idle || self.homeState.y > self.homeState.aboutToSnapToBottomAt,
                        moveToLocation: store.state.map.moveToLocation,
                        locations: store.state.home.state.last!.searchResults.results.map { $0.place },
                        onMapSettle: { position in
                            self.service.position = position
                        }
                    )
                    
                    // prevent touch on left/right sides for dragging between cards
                    HStack {
                        Color.black.opacity(0.00001).frame(width: 24)
                        Color.clear
                        Color.black.opacity(0.00001).frame(width: 24)
                    }
                    
                }
                
                //                            // keyboard dismiss (above map, below content)
                if self.keyboard.state.height > 0 {
                    Color.black.opacity(0.2)
                        .transition(.opacity)
                        .onTapGesture {
                            self.keyboard.hide()
                    }
                }
            }
            .frame(height: homeState.mapHeight)
            .cornerRadius(20)
            .shadow(color: Color.black, radius: 20, x: 0, y: 0)
            .clipped()
                //                        .animation(.spring(), value: state.animationState == .animate)
                .animation(.spring(response: 0.28))
                .offset(y: homeState.showCamera ? -Screen.height : 0)
                .rotationEffect(homeState.showCamera ? .degrees(-15) : .degrees(0))
            
            Spacer()
        }
    }
    
    class DishMapViewService: ObservableObject {
        @Published var position: CurrentMapPosition? = nil
        var cancels: Set<AnyCancellable> = []
        
        init() {
            // sync map location to state
            self.$position
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
        }
    }
}
