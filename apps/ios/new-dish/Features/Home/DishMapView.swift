import SwiftUI
import GooglePlaces
import CoreLocation
import Combine

struct DishMapView: View {
    var width: CGFloat
    var height: CGFloat
    var zoom: CGFloat = 12.0
    
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var homeState: HomeViewState
    
    var body: some View {
        ZStack {
            DishMapViewContent(
                width: width,
                height: height,
                zoom: zoom,
                animate: [.idle].contains(homeState.dragState) || homeState.animationState != .idle || self.homeState.y > self.homeState.aboutToSnapToBottomAt,
                location: store.state.map.isOnCurrent ? .current : .uncontrolled,
                locations: store.state.home.state.last!.searchResults.results.map { $0.place }
            )
            
            // prevent touch on left/right sides for dragging between cards
            HStack {
                Color.black.opacity(0.00001).frame(width: 24)
                Color.clear
                Color.black.opacity(0.00001).frame(width: 24)
            }
                
        }
    }
}

struct DishMapViewContent: View {
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
    
    var width: CGFloat
    var height: CGFloat
    var zoom: CGFloat = 12.0
    var animate: Bool = false
    var location: MapViewLocation
    var locations: [GooglePlaceItem]
    var service = DishMapViewService()
    
    @Environment(\.colorScheme) var colorScheme
    
    var body: some View {
        MapView(
            width: width,
            height: height,
            zoom: zoom,
            darkMode: self.colorScheme == .dark,
            animate: animate,
            location: location,
            locations: locations,
            onMapSettle: { position in
                self.service.position = position
            }
        )
    }
}
