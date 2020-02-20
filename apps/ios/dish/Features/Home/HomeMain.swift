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
    
    @State var position: BottomDrawerPosition = .bottom

    var drawerPosition: Binding<BottomDrawerPosition> {
        store.binding(for: \.home.drawerPosition, { .home(.setDrawerPosition($0)) })
    }
    
    func start() {
        async(500) {
            self.state.setAnimationState(.idle)
        }
    }
    
    @State var lastSearchFocus: SearchFocusState = .off
    
    func sideEffects() {
        // on focus search move drawer up
        let searchFocus = store.state.home.searchFocus
        if searchFocus != self.lastSearchFocus {
            self.lastSearchFocus = searchFocus
            store.send(.home(.setDrawerPosition(searchFocus != .off ? .top : .bottom)))
        }
        
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
                            
//                            HomeMapOverlay()
//                                .offset(y: mapHeight - App.searchBarHeight / 2)
//                                .animation(.spring())
                        }
                        .frameLimitedToScreen()
                        .opacity(state.showCamera ? 0 : 1)
                    }
                    
                    // top bar
                    TopNavView()
                        .frameLimitedToScreen()
                    
                    VStack {
                        DishLenseFilterBar()
                        Spacer()
                    }
                    // dont go up beyond mid-point
                    .offset(y: max(self.screen.height * 0.5 - 68, state.y - 68))
                    .animation(.spring())
                    
                    BottomDrawer(
                        position: self.drawerPosition,
                        snapPoints: [
                            self.screen.edgeInsets.top + 50,
                            self.screen.height * 0.5,
                            self.screen.height * 0.8
                        ],
                        cornerRadius: 20,
                        handle: nil,
                        onChangePosition: { (_, y) in
                            homeViewState.setY(y)
                        }
                    ) {
                        VStack(spacing: 0) {
                            HomeSearchBar()
                                .padding(.horizontal, 5)
                                .padding(.top, 5)
                            HomeMainContent()
                            Spacer()
                        }
                    }
                    
                    if self.store.state.home.showCuisineFilter {
                        ZStack {
                            Color.black.opacity(0.3)
                                .onTapGesture {
                                    self.store.send(.home(.toggleShowCuisineFilter))
                                }
                            
                            GeometryReader { geometry in
                                VStack {
                                    Text("Select cuisine")
                                }
                                .padding(20)
                                .frame(
                                    width: geometry.size.width - 20,
                                    height: geometry.size.width - 20
                                )
                                .background(
                                    BlurView(style: .regular)
                                )
                                .cornerRadius(50)
                                .clipped()
                            }
                        }
                    }
                    
                    // content
//                    HomeMainContentContainer(
//                        isSnappedToBottom: state.isSnappedToBottom,
//                        disableMagicTracking: state.mapHeight >= state.snapToBottomAt
//                            || state.isSnappedToBottom
//                            || state.animationState == .controlled
//                    ) {
//                        HomeSearchBar(
//                            showInput: state.animationState == .idle
//                        )
//                            .frame(width: App.screen.width - 24, height: App.searchBarHeight)
//                            .padding(.horizontal, 12)
//
//                        HomeMainContent()
//                    }
//                    .frameLimitedToScreen()
                    
                    // Search
//                    ZStack {
//                        HomeSearchAutocomplete()
//                            .opacity(showSearch == .search ? 1 : 0)
//
//                        VStack {
//
//                            //                        .scaleEffect(state.dragState == .searchbar ? 1.1 : 1)
//                            //                        .rotationEffect(.degrees(state.dragState == .searchbar ? 2 : 0))
//                            //                        .animation(.spring(), value: state.dragState == .searchbar)
//
//                            Spacer()
//                        }
//                        .offset(y: isOnShowSearch
//                            ? App.screen.edgeInsets.top + 20
//                            : mapHeight - App.searchBarHeight / 2 + state.searchBarYExtra
//                        )
//                            .animation(.spring(response: 1.25), value: state.animationState == .animate)
//                    }
//                    .opacity(state.showCamera ? 0 : 1)
                    
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
                    log.debug("ignore drag horizontal")
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


struct HomeSearchAutocomplete: View {
    var body: some View {
        VStack {
            Spacer()
                .frame(height: App.screen.edgeInsets.top + App.searchBarHeight + 60)
            
            List {
                HStack { Text("Suggested item 1") }
                HStack { Text("Suggested item 2") }
                HStack { Text("Suggested item 3") }
                HStack { Text("Suggested item 4") }
            }
        }
        .background(Color.white)
        .frameLimitedToScreen()
        .clipped()
    }
}

struct HomeSearchLocationAutocomplete: View {
    var body: some View {
        VStack {
            Spacer()
                .frame(height: App.screen.edgeInsets.top + App.searchBarHeight + 60)
            
            List {
                HStack { Text("Suggested item 1") }
                HStack { Text("Suggested item 2") }
                HStack { Text("Suggested item 3") }
                HStack { Text("Suggested item 4") }
            }
        }
        .background(Color.white)
        .frameLimitedToScreen()
        .clipped()
    }
}

struct HomeMapOverlay: View {
    @Environment(\.colorScheme) var colorScheme

    var body: some View {
        ZStack {
            ZStack {
                BlurView(style: colorScheme == .light
                    ? .systemUltraThinMaterialLight
                    : .systemUltraThinMaterialDark
                )
            }
            .clipShape(
                topCornerMask(
                    width: App.screen.width,
                    height: App.screen.height,
                    cornerRadius: 30
                )
            )
            
            ZStack {
                LinearGradient(
                    gradient: Gradient(
                        colors: [Color.red, Color.blue]
                        //                    self.colorScheme == .light
                        //                        ? [Color.black.opacity(0), Color(white: 0.1).opacity(1)]
                        //                        : [Color.black.opacity(0), Color(white: 0).opacity(1)]
                    ),
                    startPoint: .top,
                    endPoint: .bottom
                )
                    .opacity(self.colorScheme == .light ? 0.25 : 0.85)
                
                LinearGradient(
                    gradient: Gradient(
                        colors: [Color.black, Color.clear]
                    ),
                    startPoint: .top,
                    endPoint: .bottom
                )
                    .opacity(self.colorScheme == .light ? 0.25 : 0.85)
            }
            .clipShape(
                topCornerMask(
                    width: App.screen.width,
                    height: App.screen.height,
                    cornerRadius: 30
                )
            )
            .drawingGroup()
            
            ZStack {
                LinearGradient(
                    gradient: Gradient(colors: [Color.black.opacity(0), Color(white: 0).opacity(0.075)]),
                    startPoint: .center,
                    endPoint: .bottom
                )
                LinearGradient(
                    gradient: Gradient(colors: [Color.black.opacity(0), Color(white: 0).opacity(0.075)]),
                    startPoint: .center,
                    endPoint: .trailing
                )
                LinearGradient(
                    gradient: Gradient(colors: [Color.black.opacity(0), Color(white: 0).opacity(0.075)]),
                    startPoint: .center,
                    endPoint: .leading
                )
            }
            .mask(
                LinearGradient(
                    gradient: Gradient(colors: [Color.black.opacity(0), Color.black.opacity(1)]),
                    startPoint: .top,
                    endPoint: .center
                )
            )
            .drawingGroup()
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

//struct SearchBarBg: View {
//    @Environment(\.colorScheme) var colorScheme
//
//    var width: CGFloat = App.screen.width
//    var topWidth: CGFloat = 120
//    var topHeight: CGFloat = 20
//    var topRadius: CGFloat = 10
//    var searchHeight: CGFloat = 45
//
//    var shape: some View {
//        let searchRadius = searchHeight / 2
//
//        return Path { path in
//            path.addRoundedRect(
//                in: CGRect(x: 0, y: topHeight, width: width, height: searchHeight),
//                cornerSize: CGSize(width: searchRadius, height: searchRadius)
//            )
//
//            var p2 = Path()
//            p2.addRoundedRect(
//                in: CGRect(x: searchRadius, y: searchHeight, width: topWidth, height: topHeight * 2),
//                cornerSize: CGSize(width: topRadius, height: topRadius)
//            )
//
//            path.addPath(p2)
//        }
//    }
//
//    var body: some View {
//        self.shape
//            .foregroundColor(.white)
//            .shadow(color: Color.black.opacity(self.colorScheme == .dark ? 0.6 : 0.3), radius: 8, x: 0, y: 1)
//    }
//}
