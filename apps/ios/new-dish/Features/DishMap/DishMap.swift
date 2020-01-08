import SwiftUI
import GooglePlaces
import CoreLocation

struct DishMapView: View {
    var width: CGFloat
    var height: CGFloat
    var zoom: CGFloat = 12.0
    
    @Environment(\.colorScheme) var colorScheme
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        return MapView(
            width: width,
            height: height,
            zoom: zoom,
            darkMode: self.colorScheme == .dark,
            location: store.state.location.isOnCurrent ? .current : .uncontrolled,
            locations: store.state.home.state.last!.searchResults.results.map { $0.place }
        )
    }
}
