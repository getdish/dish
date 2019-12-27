import SwiftUI

struct DishMapView: View {
    var width: CGFloat
    var height: CGFloat
    
    @Environment(\.colorScheme) var colorScheme
    
    var body: some View {
        MapView(
            width: width,
            height: height,
            darkMode: self.colorScheme == .dark
        )
    }
}
