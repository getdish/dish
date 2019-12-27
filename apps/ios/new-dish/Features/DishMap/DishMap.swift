import SwiftUI
import GooglePlaces
import CoreLocation

struct DishMapView: View {
    var width: CGFloat
    var height: CGFloat
    
    @Environment(\.colorScheme) var colorScheme
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        return MapView(
            width: width,
            height: height,
            darkMode: self.colorScheme == .dark,
            location: store.state.location.isOnCurrent ? .current : .uncontrolled
        )
    }
}
