import SwiftUI

struct RootView: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.geometry) var appGeometry

    func start() {
        async(3000) {
            self.store.send(.hideSplash)
            async(500) {
                self.store.send(.setAppLoaded)
            }
        }
    }
    
    var body: some View {
        let size: CGFloat = self.store.state.showSplash
            ? 1000
            : 0
        
        return ZStack {
            Color.clear.onAppear {
                self.start()
            }
            
            if appGeometry != nil {
                HomeView()
                PrintGeometryView("RootView")
            }
            
            Color.red
                .opacity(0.25)
                .frame(width: size, height: size)
                .cornerRadius(1000)
                .animation(.spring())
                .frameLimitedToScreen()
                .clipped()
            
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
