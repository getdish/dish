import SwiftUI
import GooglePlaces
import CoreLocation
import Combine

struct DishMapView: View {
    var width: CGFloat
    var height: CGFloat
    var zoom: CGFloat = 12.0
    
    @Environment(\.colorScheme) var colorScheme
    @Environment(\.geometry) var appGeometry
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var homeState: HomeViewState
    
    var service = DishMapViewService()
    
    var body: some View {
        let appHeight: CGFloat = appGeometry?.size.height ?? Screen.height
        let visibleHeight = homeState.mapHeight - (homeState.isSnappedToBottom ? cardRowHeight : 0)
        let hiddenBottomPct: CGFloat = (appHeight - visibleHeight) / appHeight

        return ZStack {
            MapView(
                width: width,
                height: height,
                hiddenBottomPct: hiddenBottomPct,
                zoom: zoom,
                darkMode: self.colorScheme == .dark,
                animate: [.idle].contains(homeState.dragState) || homeState.animationState != .idle || self.homeState.y > self.homeState.aboutToSnapToBottomAt,
                location: store.state.map.isOnCurrent ? .current : .uncontrolled,
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
