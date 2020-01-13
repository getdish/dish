import SwiftUI
import GooglePlaces
import CoreLocation

struct DishMapView: View {
    var width: CGFloat
    var height: CGFloat
    var zoom: CGFloat = 12.0
    
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var homeState: HomeViewState
    
    var body: some View {
        DishMapViewContent(
            width: width,
            height: height,
            zoom: zoom,
            animate: [.idle, .animating].contains(homeState.state) || self.homeState.y > self.homeState.aboutToSnapToBottomAt,
            location: store.state.location.isOnCurrent ? .current : .uncontrolled,
            locations: store.state.home.state.last!.searchResults.results.map { $0.place }
        )
    }
}

struct DishMapViewContent: View {
    var width: CGFloat
    var height: CGFloat
    var zoom: CGFloat = 12.0
    var animate: Bool = false
    var location: MapViewLocation
    var locations: [GooglePlaceItem]
    
    @Environment(\.colorScheme) var colorScheme
    
    var body: some View {
        print("!!!!!!!!!!!!!!!!!! render map view...")
        return MapView(
            width: width,
            height: height,
            zoom: zoom,
            darkMode: self.colorScheme == .dark,
            animate: animate,
            location: location,
            locations: locations
        )
    }
}
