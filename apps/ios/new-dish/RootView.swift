import SwiftUI

struct RootView: View {
    var body: some View {
        ContextMenuRootView {
            HomeContainerView()
        }
    }
}

struct RootView_Previews: PreviewProvider {
    static var previews: some View {
        RootView()
    }
}
