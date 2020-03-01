import SwiftUI

struct HomeView: View {
  @Environment(\.colorScheme) var colorScheme: ColorScheme
  @State private var sideDrawerShown = false

  var body: some View {
    HomeViewInner()
      .equatable()
      .frameLimitedToScreen()
      .embedInGeometryReader()
  }
}

fileprivate let homePageCount = 3
let homePager = PagerStore(
  index: 1
)

fileprivate let homeViewsIndex: [HomePageView] = [.me, .home, .camera]

struct HomeViewInner: View, Equatable {
  static func == (l: Self, r: Self) -> Bool { true }

  @EnvironmentObject var store: AppStore
  @EnvironmentObject var screen: ScreenModel
  @State var disableDragging = true
  @State var isDragging = false

  var body: some View {
    async {
      if self.store.state.home.view != homeViewsIndex[Int(homePager.index)] {
        homePager.animateTo(Double(homeViewsIndex.firstIndex(of: self.store.state.home.view)!))
      }
    }
    return ZStack {      
      PrintGeometryView("HomeView")

      PagerView(
        pageCount: homePageCount,
        pagerStore: homePager,
        disableDragging: store.state.home.view == .home
      ) { isDragging in
        //
        // ⚠️ ⚠️ ⚠️
        //    ADDING .clipped() to any of these causes perf issues!!!
        //    animations below seem to be choppier
        // ⚠️ ⚠️ ⚠️
        // account page
        DishAccount()
          .zIndex(0)

        // home page
        HomeMainView()
          .zIndex(2)

        // camera page
        DishCamera()
          .zIndex(0)
      }
        .onChangeDrag { isDragging in
          print("set isDragging \(isDragging)")
          self.isDragging = isDragging
        }
        .onChangePage { index in
          print("change page to index \(index)")
          let view = homeViewsIndex[index]
          self.disableDragging = view == .home
          self.store.send(.home(.setView(view)))
        }
        // just drag from edge (to camera/account)
//        .simultaneousGesture(
//          DragGesture()
//            .onChanged { value in
//              if homeViewState.dragState == .searchbar { return }
//              let isOnRightEdge = self.screen.width - value.startLocation.x < 10
//              let isOnLeftEdge = value.startLocation.x < 10
//              if isOnRightEdge || isOnLeftEdge {
//                if abs(value.translation.width) > 10 {
//                  homeViewState.setDragState(.pager)
//                }
//                homePager.drag(value)
//              }
//            }
//            .onEnded { value in
//              if homeViewState.dragState == .pager {
//                homePager.onDragEnd(value)
//                homeViewState.setDragState(.idle)
//              }
//            }
//        )
    }
  }
}

struct HomeView_Previews: PreviewProvider {
  static var previews: some View {
    HomeView()
      .embedInAppEnvironment()
  }
}
