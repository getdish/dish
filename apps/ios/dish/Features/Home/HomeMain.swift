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
                                    .offset(y: -(state.mapFullHeight - mapHeight) / 2 + 25 /* topbar offset */)
                                    .animation(.spring(response: 0.65))
                            }
                            .frameLimitedToScreen()
                            .clipped()
                            .opacity(animationState == .splash ? 0 : 1)
                        }
                        .frameLimitedToScreen()
                        .opacity(state.showCamera ? 0 : 1)
                    }
                    
                    HomeMapResultsBar()
                        .offset(y: max(state.y, App.drawerSnapPoints[1]) + (
                            self.store.state.home.drawerPosition == .bottom && !self.store.state.home.drawerIsDragging
                                ? -App.mapBarHeight
                                : 0
                        ))
                        .animation(.spring())
                    
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
//            .simultaneousGesture(self.dragGesture)
            
            DishRestaurantView()
            
        }
            .environmentObject(self.state)
    }

    var dragGesture: _EndedGesture<_ChangedGesture<DragGesture>> {
        var ignoreThisDrag = false

        return DragGesture(minimumDistance: 10)
            .onChanged { value in
                print("drag ignore \(ignoreThisDrag) state \(self.state.dragState)")
                if ignoreThisDrag {
                    return
                }
                if [.off, .pager, .contentHorizontal].contains(self.state.dragState) {
                    return
                }
                let isAlreadyDragging = self.state.dragState == .searchbar
                let isDraggingBelowSearchbar = value.startLocation.y > self.state.y
                let isDraggingHorizontal = abs(value.translation.width) > abs(value.translation.height)
                    && abs(value.translation.width) > 15
                if !isAlreadyDragging
                    && isDraggingBelowSearchbar
                    && isDraggingHorizontal
                     {
                    logger.debug("ignore drag horizontal")
                    self.state.setDragState(.contentHorizontal)
                    ignoreThisDrag = true
                    return
                }

                let isDraggingSearchBar = self.state.isWithinDraggableArea(value.startLocation.y)
//                let isDraggingBelowSearchBar = self.state.isActiveScrollViewAtTop
//                    && HomeSearchBarState.isBelow(value.startLocation.y)

                //                print("☕️ self.state.isActiveScrollViewAtTop \(self.state.isActiveScrollViewAtTop) isDraggingBelowSearchBar \(isDraggingBelowSearchBar) height \(value.translation.height)")

                if isAlreadyDragging || isDraggingSearchBar {
                    if self.keyboard.state.height > 0 {
                        self.keyboard.hide()
                    }
                    let next = value.translation.height.round(nearest: 0.5)
                    if next != self.state.y {
                        self.state.setY(next)
                    }
                }
            }
            .onEnded { value in
                if !ignoreThisDrag {
                    if [.idle, .searchbar].contains(self.state.dragState) {
                        self.state.finishDrag(value)
                    }
                    self.state.setDragState(.idle)
                }
                ignoreThisDrag = false
            }
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
