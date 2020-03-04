import Combine
import SwiftUI

struct HomeView: View {
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

  var mapFullHeight: CGFloat {
    self.screen.height * 1.5
  }
  
  var snapPoints: [CGFloat] {
    return store.state.home.drawerPosition == .bottom &&
      store.state.home.showFilters == false
      ? [App.drawerSnapPoints[0], App.drawerSnapPoints[1], App.drawerSnapPoints[2] + App.filterBarHeight]
      : App.drawerSnapPoints
  }

  @State var lastSearchFocus: SearchFocusState = .off

  var body: some View {
    let state = self.state
    let showMapRow = self.store.state.home.drawerPosition == .bottom
      && !self.store.state.home.drawerIsDragging
    let y: CGFloat = (self.screen.height - self.mapFullHeight) * 0.75
      // move with drawer (but just a bit less than half because when fully open, we show a bottom results drawer)
      + (state.y - self.snapPoints[1]) * 0.4
      // adjust for any awkwardness
      + 20

    return ZStack(alignment: .topLeading) {
      PrintGeometryView("HomeView")

      // below restaurant card
      ZStack {
        // matches LinearGradient below for covering map
        Color(.systemBackground)
        
        // wrapper to handle disabling touch events during dragging
        ZStack {
          // Map
          if App.enableMap {
            ZStack {
              MapViewContainer()
                .offset(y: y)
                .animation(.spring(response: 2))
                .invertColorScheme()
            }
            .frameLimitedToScreen()
            .clipped()
          }

          // map overlay fade to bottom
          HomeViewMapOverlay()

          VStack(spacing: 0) {
            MapViewLenseFilterBar()
            Spacer()
          }
          // dont go up beyond mid-point
            .offset(y: max(self.snapPoints[1] - 68 - 30, state.y - 68))
            .animation(.spring(response: 0.6))

          // map results bar
          VStack {
            MapResultsBar()
            Spacer()
          }
          .offset(
            y: self.snapPoints[2] + (
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

          HomeDrawerView(
            snapPoints: self.snapPoints
          )
            .equatable()

          HomeViewFocusedItem(
            focusedItem: self.store.state.home.focusedItem,
            showBookmark: self.store.state.home.drawerPosition != .bottom,
            showDescription: self.store.state.home.drawerPosition != .bottom
          )

          HomeViewCuisineFilterPopup(
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
      HomeView()
        .embedInAppEnvironment()  // Mocks.homeSearchedPho
    }
  }
#endif
