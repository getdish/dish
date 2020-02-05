import SwiftUI

struct RootView: View {
    @Environment(\.geometry) var appGeometry
    
    var body: some View {
        ContextMenuRootView {
            if appGeometry != nil {
                HomeView()
                PrintGeometryView("RootView")
            }
        }
    }
}
