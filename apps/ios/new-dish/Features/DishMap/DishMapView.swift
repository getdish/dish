import SwiftUI
import GooglePlaces
import CoreLocation

struct DishMapView: View {
    var width: CGFloat
    var height: CGFloat
    var zoom: CGFloat = 12.0
    
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var homeState: HomeViewState
    @Environment(\.colorScheme) var colorScheme
    
    var body: some View {
        ZStack {
            MapView(
                width: width,
                height: height,
                zoom: zoom,
                darkMode: self.colorScheme == .dark,
                animate: [.idle].contains(homeState.dragState) || homeState.animationState != .idle || self.homeState.y > self.homeState.aboutToSnapToBottomAt,
                location: store.state.location.isOnCurrent ? .current : .uncontrolled,
                locations: store.state.home.state.last!.searchResults.results.map { $0.place }
            )
            
            // prevent touch on left/right sides for dragging between cards
            HStack {
                Color.black.opacity(0.0001).frame(width: 20)
                Color.clear
                Color.black.opacity(0.0001).frame(width: 20)
            }
        }
    }
}
