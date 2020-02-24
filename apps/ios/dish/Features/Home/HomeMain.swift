import SwiftUI
import Combine

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

    @State var wasOnSearchResults = false
    @State var wasOnCamera = false
    @State var contentWrappingView: UIView? = nil

    func start() {
        async(500) {
            self.state.setAnimationState(.idle)
        }
    }
    
    @State var lastSearchFocus: SearchFocusState = .off
    
    func sideEffects() {
        // set app height
        if self.appGeometry?.size.height != self.state.appHeight {
            if let height = self.appGeometry?.size.height {
                self.state.setAppHeight(height)
            }
        }
        
        if Selectors.home.isOnSearchResults() != self.wasOnSearchResults {
            let val = Selectors.home.isOnSearchResults()
            self.wasOnSearchResults = val
            if val {
                self.state.moveToSearchResults()
            }
        }
        
        let isOnCamera = self.store.state.home.view == .camera
        if isOnCamera != self.wasOnCamera {
            let val = self.store.state.home.view == .camera
            self.wasOnCamera = val
            self.state.setShowCamera(val)
        }
    }

    var body: some View {
        let state = self.state
        let animationState = state.animationState
        let mapHeight = state.mapHeight
        let showMapRow = self.store.state.home.drawerPosition == .bottom
            && !self.store.state.home.drawerIsDragging
//        let isOnShowSearch = searchFocus != .off
        //        let enableSearchBar = [.idle, .off].contains(state.dragState) && state.animationState == .idle

        print(" 👀 HomeMainView mapHeight \(mapHeight) animationState \(state.animationState)")

        return ZStack(alignment: .topLeading) {
            Run("sideeffects") { self.sideEffects() }
            RunOnce(name: "start") { self.start() }
            PrintGeometryView("HomeMainView")
            
            // below restaurant card
            ZStack {
                // wrapper to handle disabling touch events during dragging
                ZStack {
                    
                    // Camera
                    if App.enableCamera && animationState != .splash {
                        ZStack {
                            DishCamera()
                            
                            // cover camera
                            Color.black
                                .opacity(state.showCamera ? 0 : 1)
                                .animation(.spring())
                        }
                        .frameLimitedToScreen()
                    }
                    
                    // Map
                    if App.enableMap {
                        ZStack {
                            ZStack {
                                DishMapView(
                                    height: state.mapFullHeight,
                                    animate: [.idle].contains(state.dragState)
                                        || state.animationState != .idle
                                        || state.mapHeight > state.startSnapToBottomAt
                                )
                                    
                                    .offset(y:
                                        // centered
                                        (self.screen.height - state.mapFullHeight) * 0.5
                                        // move with drawer (but just a bit less than half because when fully open, we show a bottom results drawer)
                                        + (state.y - App.drawerSnapPoints[1]) * 0.4
                                        // subtract just a bit because LenseBar is taller than TopNav
                                        - 20
                                    )
                                    .animation(.spring(response: 0.65))
                            }
                            .frameLimitedToScreen()
                            .clipped()
                            .opacity(animationState == .splash ? 0 : 1)
                        }
                        .frameLimitedToScreen()
                        .opacity(state.showCamera ? 0 : 1)
                    }
                    
                    VStack {
                        HomeMapResultsBar()
                        Spacer()
                    }
                        .offset(y: App.drawerSnapPoints[2] + (
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
                    .animation(.spring())
                    
                    HomeMainDrawer()
                        .equatable()
                    
                    // top bar
                    TopNavView()
                        .frameLimitedToScreen()
                    
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
            .clipped() // dont remove fixes bug cant click SearchBar
            
            DishRestaurantView()
            
        }
            .environmentObject(self.state)
    }
}

#if DEBUG
struct HomeMainView_Previews: PreviewProvider {
    static var previews: some View {
        HomeMainView()
            .embedInAppEnvironment() // Mocks.homeSearchedPho
    }
}
#endif
