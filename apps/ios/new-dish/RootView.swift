import SwiftUI

struct RootView: View {
    var body: some View {
        ContextMenuRootView {
            HomeContainerView()
            PrintGeometryView("RootView")
        }
    }
}
