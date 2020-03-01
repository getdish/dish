import Combine
import SwiftUI

struct HomeMainView: View {
  @EnvironmentObject var screen: ScreenModel
  @EnvironmentObject var store: AppStore
  @EnvironmentObject var keyboard: Keyboard
  @Environment(\.geometry) var appGeometry
  @Environment(\.colorScheme) var colorScheme

  //
  // fast moving state of this view and sub-views:
  //
  @ObservedObject var state = homeViewState

  @State var contentWrappingView: UIView? = nil

  func start() {
    async(500) {
      self.state.setAnimationState(.idle)
    }
  }

  var mapFullHeight: CGFloat {
    self.screen.height * 1.5
  }

  @State var lastSearchFocus: SearchFocusState = .off

  var body: some View {
    let state = self.state
    let showMapRow = self.store.state.home.drawerPosition == .bottom
      && !self.store.state.home.drawerIsDragging

    return ZStack(alignment: .topLeading) {
      RunOnce(name: "start") { self.start() }
      PrintGeometryView("HomeMainView")

      // below restaurant card
      ZStack {
        // wrapper to handle disabling touch events during dragging
        ZStack {
          // Map
          if App.enableMap {
            MapViewContainer()
              .offset(
                y:  // centered
                (self.screen.height - self.mapFullHeight) * 0.5
                  // move with drawer (but just a bit less than half because when fully open, we show a bottom results drawer)
                  + (state.y - App.drawerSnapPoints[1]) * 0.4
                  // subtract just a bit because LenseBar is taller than TopNav
                  - 20
              )
              .animation(.spring(response: 0.65))
          }
          
//          Color.clear
//            .frame(height)
//            .background(
//              ZStack {
//                self.colorScheme == .dark
//                  ? LinearGradient(
//                    gradient: Gradient(colors: [.clear, .black]),
//                    startPoint: .top,
//                    endPoint: .center
//                    )
//                  : LinearGradient(
//                    gradient: Gradient(colors: [Color.clear, Color.init(white: 0, opacity: 0.2)]),
//                    startPoint: .top,
//                    endPoint: .bottom
//                )
//              }
//              .drawingGroup()
//          )

          VStack(spacing: 0) {
            DishLenseFilterBar()
            Spacer()
          }
          // dont go up beyond mid-point
            .offset(y: max(App.drawerSnapPoints[1] - 68 - 30, state.y - 68))
            .animation(.spring(response: 1))

          // map results bar
          VStack {
            MapResultsBar()
            Spacer()
          }
          .offset(
            y: App.drawerSnapPoints[2] + (
              showMapRow
                ? -App.mapBarHeight - 68
                : 0
            ))
            .opacity(showMapRow ? 1 : 0)
            .animation(.spring(response: 1))
            .disabled(!showMapRow)
          
          // top bar
          ControlsBar()
            .equatable()

          HomeMainDrawer()
            .equatable()
          
          HomeFocusedItemView(
            focusedItem: self.store.state.home.focusedItem
          )

          HomeCuisineFilterPopup(
            active: self.store.state.home.showCuisineFilter
          )

          // make everything untouchable while dragging
          Color.black.opacity(0.0001)
            .frame(width: state.dragState == .pager ? App.screen.width : 0)
        }
        // cancels started touch events once drag starts
          .disabled(state.dragState != .idle)
      }
        .clipped()  // dont remove fixes bug cant click SearchBar

      DishRestaurantView()

    }
      .environmentObject(self.state)
  }
}

#if DEBUG
  struct HomeMainView_Previews: PreviewProvider {
    static var previews: some View {
      HomeMainView()
        .embedInAppEnvironment()  // Mocks.homeSearchedPho
    }
  }
#endif
