import Combine
import SwiftUI

struct HomeMainView: View {
  @EnvironmentObject var screen: ScreenModel
  @EnvironmentObject var store: AppStore
  @EnvironmentObject var keyboard: Keyboard
  @Environment(\.geometry) var appGeometry
  @Environment(\.colorScheme) var colorScheme

  //
  // main state of this view and sub-views:
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
            DishMapViewContainer()
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

          // below drawer
          VStack {
            DishMapResultsBar()
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

          VStack(spacing: 0) {
            DishLenseFilterBar()
            Spacer()
          }
          // dont go up beyond mid-point
            .offset(y: max(App.drawerSnapPoints[1] - 68 - 30, state.y - 68))
            .animation(.spring(response: 1))

          // top bar
          ControlsBar()
            .equatable()

          HomeMainDrawer()
            .equatable()
          
          HomeFocusedDishView(
            focusedDish: self.store.state.home.listItemFocusedDish
          )

          DishCuisineFilterPopup(
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

struct HomeFocusedDishView: View {
  var focusedDish: FocusedDishItem? = nil
  
  var height: CGFloat {
    140
  }
  
  var body: some View {
    SwipeDownToDismissView(
      onClose: {
        App.store.send(.home(.setListItemFocusedDish(nil)))
      }
    ) {
      VStack {
        HStack {
          VStack(spacing: 14) {
            Text("Miss Saigon")
              .font(.system(size: 20))
              .fontWeight(.bold)
            Text("Traditional northern style pho known for the broth.")
              .font(.system(size: 16))
            Text("Closes 8pm · Vietnamese 🇻🇳")
              .font(.system(size: 14))
          }
          .environment(\.colorScheme, .dark)
          .padding(.horizontal, 25)
          .padding(.vertical, 15)
          .background(Color.black.opacity(0.8))
          .cornerRadiusSquircle(23)
          .frame(width: 260, height: self.height)
          .overlay(
            VStack {
              HStack {
                Text("\(self.focusedDish?.rank ?? 0).")
                  .font(.system(size: 16))
                  .fontWeight(.black)
                  .frame(width: 32, height: 32)
                  .background(Color.white)
                  .cornerRadius(32)
                  .rotationEffect(.degrees(-17))
                  .offset(x: 12, y: -12)
                Spacer()
                Image(systemName: "bookmark")
                  .padding(20)
                  .modifier(
                    ControlsButtonStyle(background: Color.purple, cornerRadius: 100, hPad: 0)
                  )
                  .offset(x: 18, y: -18)
                  .scaleEffect(1.1)
              }
              Spacer()
            }
          )
          .shadow(color: Color.black.opacity(0.25), radius: 16, y: 5)
          .shadow(color: Color.black.opacity(0.25), radius: 10, x: -10, y: 5)
          
          Spacer()
        }
        .padding(.leading, 12)
        Spacer()
      }
    }
      .id(self.focusedDish?.dish.id ?? 0)
      .opacity(self.focusedDish == nil ? 0 : 1)
      .offset(y: (self.focusedDish?.targetMinY ?? 0) - self.height - 20)
      .animation(.spring())
  }
}


struct SwipeDownToDismissView<Content>: View where Content: View {
  @State var dragY: CGFloat = 0
  @State var animateY: CGFloat = 0
  @State var opacity: Double = 1
  
  var onClose: (() -> Void)? = nil
  var content: () -> Content
  
  func scalePull(_ number: CGFloat) -> CGFloat {
    return ((number - 0) / (-500 - 0) * 4) + 1
  }
  
  var body: some View {
    ZStack {
      self.content()
      .offset(
        y: self.animateY + self.dragY
      )
      .opacity(self.opacity)
      .gesture(
        DragGesture()
          .onChanged { drag in
            var dy = drag.translation.height
            
            let lim: CGFloat = -60
            if dy < lim {
              let extra = dy + 60
              dy = lim + extra * (1 / self.scalePull(dy + 60))
            }
            
            self.dragY = dy
          }
          .onEnded { drag in
            let endY = drag.location.y + drag.predictedEndLocation.y
            let shouldClose = endY > 500
            print("ok endY \(endY)")
            
            if shouldClose {
              let continueY = drag.predictedEndTranslation.height
              let duration: Double = Double(continueY) / 500
              withAnimation(.easeOut(duration: duration)) {
                self.animateY = continueY
                self.opacity = 0
              }
              async(duration / 1000) {
                if let cb = self.onClose {
                  cb()
                }
              }
            } else {
              withAnimation(.spring()) {
                self.dragY = 0
              }
            }
          }
      )
    }
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
