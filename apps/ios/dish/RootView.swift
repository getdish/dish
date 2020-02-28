import SwiftUI

struct RootView: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.geometry) var appGeometry

    func start() {
        async(1000) {
            self.store.send(.home(.hideSplash))
            async(200) {
                self.store.send(.home(.setAppLoaded))
            }
        }
    }
    
    var body: some View {
        let size: CGFloat = self.store.state.home.appLoaded
            ? 500
            : 0
        
        return ZStack {
            Color.clear.onAppear {
                self.start()
            }
            
            if appGeometry != nil {
                HomeView()
                PrintGeometryView("RootView")
            }
            
//            Circle()
//                .frame(width: size, height: size)
//                .animation(.spring())

//            Image("LaunchScreen2")
//                .mask(
//                    Circle()
//                        .frame(width: size, height: size)
//                )
        }
    }
}
