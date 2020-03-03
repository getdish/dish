import SwiftUI

fileprivate let homePageCount = 3
let homePager = PagerStore(index: 1)
fileprivate let rootViews: [HomePageView] = [.me, .home, .camera]

struct RootView: View {
  @EnvironmentObject var store: AppStore
  @EnvironmentObject var screen: ScreenModel
  @State var disableDragging = true
  @State var isDragging = false
  @Environment(\.geometry) var appGeometry

  func start() {
    async(50) {
      self.store.send(.setAppLoaded)
      async(2000) {
        self.store.send(.hideSplash)
      }
    }
  }

  var body: some View {
    async {
      if self.store.state.view != rootViews[Int(homePager.index)] {
        homePager.animateTo(Double(rootViews.firstIndex(of: self.store.state.view)!))
      }
    }
    
    return ZStack {
      Color.black
      PrintGeometryView("RootView")
      Color.clear.onAppear(perform: self.start)
      VStack {
        if self.appGeometry != nil {
          ZStack {
            PagerView(
              pageCount: homePageCount,
              pagerStore: homePager,
              disableDragging: store.state.view == .home
            ) { isDragging in
              //
              // ⚠️ ⚠️ ⚠️
              //    ADDING .clipped() to any of these causes perf issues!!!
              //    animations below seem to be choppier
              // ⚠️ ⚠️ ⚠️
              // account page
              AccountView()
                .zIndex(0)
              
              // home page
              HomeView()
                .zIndex(2)
              
              // camera page
              DishCameraView()
                .zIndex(0)
            }
            .onChangeDrag { isDragging in
              print("set isDragging \(isDragging)")
              self.isDragging = isDragging
            }
            .onChangePage { index in
              print("change page to index \(index)")
              let view = rootViews[index]
              self.disableDragging = view == .home
              self.store.send(.setView(view))
            }
          }
        }
      }
      SplashView()
    }
//    .invertColorScheme()
  }
}

struct RootView_Previews: PreviewProvider {
  static var previews: some View {
    RootView()
      .embedInAppEnvironment()
  }
}

// just drag from edge (to camera/account)
//        .simultaneousGesture(
//          DragGesture()
//            .onChanged { value in
//              if rootViewstate.dragState == .searchbar { return }
//              let isOnRightEdge = self.screen.width - value.startLocation.x < 10
//              let isOnLeftEdge = value.startLocation.x < 10
//              if isOnRightEdge || isOnLeftEdge {
//                if abs(value.translation.width) > 10 {
//                  rootViewstate.setDragState(.pager)
//                }
//                homePager.drag(value)
//              }
//            }
//            .onEnded { value in
//              if rootViewstate.dragState == .pager {
//                homePager.onDragEnd(value)
//                rootViewstate.setDragState(.idle)
//              }
//            }
//        )
