import SwiftUI
import Combine

struct HomeMainView: View {
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
    
    var sideEffects: some View {
        // non visual
        Group {
            // dev helpers
            PrintGeometryView("HomeMainView")
            
            // weird way to set appheight
//            Run {
//                guard let g = self.appGeometry else { return }
//                if self.state.appHeight != g.size.height {
//                    self.state.setAppHeight(g.size.height)
//                }
//            }
        }
    }

    var body: some View {
        // ⚠️
        // TODO can we put this somewhere more natural?
        // ⚠️
        self.runSideEffects()
        
        let state = self.state
        let mapHeight = state.mapHeight
//        let enableSearchBar = [.idle, .off].contains(state.dragState) && state.animationState == .idle
//        print(" 👀 HomeMainView mapHeight \(mapHeight) animationState \(state.animationState) enableSearchBar \(enableSearchBar)")

        return GeometryReader { geometry in
            ZStack(alignment: .topLeading) {
                    self.sideEffects
                
                    // CAMERA
                    if App.enableCamera {
                        Group {
                            // camera
                            ZStack {
                                DishCamera()
                                
                                // cover camera
                                Color.black
                                    .animation(.spring())
                                    .opacity(state.showCamera ? 0 : 1)
                            }
                            .frameLimitedToScreen()
                        }
                    }
                    
                    // MAP
                    if App.enableMap {
                        Group {
                            // map
                            DishMapView()
                                .frame(height: self.appGeometry?.size.height)
                                .offset(y: state.showCamera ? -Screen.height : 0)
                                .opacity(state.showCamera ? 0 : 1)
                                .animation(.spring(response: 0.8))
                                .rotationEffect(state.showCamera ? .degrees(-10) : .degrees(0))
                                .frameLimitedToScreen()
                            
                            // map mask a bit
                            HomeMapMask()
                                .offset(y: mapHeight - 20)
                                .animation(.spring(response: 0.4))
                            
                            // map fade out at bottom
                            VStack {
                                Spacer()
                                HomeMapBackgroundGradient()
                                    .frame(height: (self.appGeometry?.size.height ?? 0) - state.mapHeight)
                            }
                        }
                    }
                
                    // CONTENT / CHROME
                    if App.enableContent {
                        Group {
                            // location bar
                            VStack {
                                TopNavViewContent()
                                Spacer()
                            }
                            .frameLimitedToScreen()
                            
                            // content
                            HomeMainContentContainer(
                                isSnappedToBottom: state.isSnappedToBottom,
                                disableMagicTracking: state.mapHeight >= state.snapToBottomAt
                                    || state.isSnappedToBottom
                                    || state.animationState == .controlled
                            ) {
                                HomeMainContent()
                            }
                            .frameLimitedToScreen()
                            .offset(y: state.showCamera ? Screen.height : 0)
                            
                            // filters
                            VStack {
                                HomeMainFilterBar()
                                Spacer()
                            }
                            .frameLimitedToScreen()
                            .offset(y: mapHeight + App.searchBarHeight / 2)
                            //                        .animation(.spring())
                        }
                    }
                
                    // SEARCHBAR
                    Group {
                        // searchbar
                        VStack {
                            GeometryReader { searchBarGeometry -> HomeSearchBar in
                                HomeSearchBarState.frame = searchBarGeometry.frame(in: .global)
                                return HomeSearchBar()
                            }
                                .frame(height: App.searchBarHeight)
                                .padding(.horizontal, 12)
                            
                            Spacer()
                        }
                            // this fixed a bug where it would focus search bar too easily
                            // but created one where it de-focuses it instantly often
                            //                    .disabled(!enableSearchBar)
                            //                    .allowsHitTesting(enableSearchBar)
                            .offset(y:
                                state.showCamera ?
                                    mapHeight > Screen.height / 2 ? Screen.height * 2 : -Screen.height * 2 :
                                    mapHeight - App.searchBarHeight / 2 + state.searchBarYExtra
                        )
                            .animation(.spring(response: 1.25), value: state.animationState == .animate)
                    }
                
                
                    // CAMERA CONTROLS
                    if App.enableCamera {
                        ZStack {
                            VStack {
                                HStack {
                                    Spacer()
                                    CameraButton(
                                        foregroundColor: state.showCamera ? .white : .black
                                    )
                                        .scaleEffect(state.showCamera ? 1.3 : 1)
                                        .offset(
                                            x: state.showCamera
                                                ? -Screen.width / 2 + App.cameraButtonHeight / 2
                                                : -15,
                                            y: state.showCamera
                                                ? Screen.fullHeight - App.cameraButtonHeight - 100
                                                : state.mapHeight + state.searchBarYExtra - App.cameraButtonHeight / 2
                                    )
                                    //                                    .animation(Animation.spring(response: 0.4).delay(0))
                                }
                                Spacer()
                            }
                        }
                        .frameLimitedToScreen()
                    }
                
                    // make everything untouchable while dragging
                    Color.black.opacity(0.0001)
                        .frame(width: state.dragState == .pager ? Screen.width : 0)
                }
                .clipped() // dont remove fixes bug cant click SearchBar
//                .shadow(color: Color.black.opacity(0.25), radius: 20, x: 0, y: 0)
                .simultaneousGesture(self.dragGesture)
            }
            .environmentObject(self.state)
    }
    
    private func runSideEffects() {
        // pushed map below the border radius of the bottomdrawer
        let isOnSearchResults = Selectors.home.isOnSearchResults()
        if isOnSearchResults != wasOnSearchResults {
            async {
                self.wasOnSearchResults = isOnSearchResults
                if isOnSearchResults {
                    self.state.moveToSearchResults()
                }
            }
        }
        
        // camera animation
        let isOnCamera = App.store.state.home.showCamera
        if isOnCamera != wasOnCamera {
            print("CHANGE camera \(isOnCamera) \(wasOnCamera)")
            async {
                self.wasOnCamera = isOnCamera
                self.state.setShowCamera(isOnCamera)
            }
        }
        
        
        if let height = appGeometry?.size.height, height != state.appHeight {
            async {
                self.state.setAppHeight(height)
            }
        }
    }
    
    var dragGesture: _EndedGesture<_ChangedGesture<DragGesture>> {
        return DragGesture(minimumDistance: 10)
            .onChanged { value in
                if [.off, .pager].contains(self.state.dragState) {
//                    print("☕️ ignore \(self.state.dragState)")
                    return
                }
                
                let isAlreadyDragging = self.state.dragState == .searchbar
                let isDraggingSearchBar = HomeSearchBarState.isWithin(value.startLocation.y)
                let isDraggingBelowSearchBar = self.state.isActiveScrollViewAtTop
                    && HomeSearchBarState.isBelow(value.startLocation.y)
                
//                print("☕️ self.state.isActiveScrollViewAtTop \(self.state.isActiveScrollViewAtTop) isDraggingBelowSearchBar \(isDraggingBelowSearchBar) height \(value.translation.height)")
//                 || isDraggingBelowSearchBar
                
                if isAlreadyDragging || isDraggingSearchBar {
                    // hide keyboard on drag
                    if self.keyboard.state.height > 0 {
                        self.keyboard.hide()
                    }
                    // drag
                    self.state.setY(value.translation.height)
                }
        }
        .onEnded { value in
            if [.idle, .searchbar].contains(self.state.dragState) {
                self.state.finishDrag(value)
            }
            self.state.setDragState(.idle)
        }
    }
}

struct HomeMapBackgroundGradient: View {
    @Environment(\.colorScheme) var colorScheme
    
    var body: some View {
        LinearGradient(
            gradient: Gradient(
                colors: self.colorScheme == .light
                    ? [Color.black.opacity(0), Color.black.opacity(0.3), Color(white: 0.1).opacity(0.55)]
                    : [Color.black.opacity(0), Color.black.opacity(0.3), Color(white: 0).opacity(0.55)]
            ),
            startPoint: .top,
            endPoint: .bottom
        )
            .rasterize()
    }
}

struct HomeMapMask: View {
    var body: some View {
        LinearGradient(
            gradient: Gradient(
                colors: [
                    Color(white: 0).opacity(0.7), Color(white: 0).opacity(0), Color.black.opacity(0)
                ]
            ),
            startPoint: .top,
            endPoint: .bottom
        )
            .clipShape(
                topCornerMask(
                    width: Screen.width,
                    height: Screen.fullHeight,
                    cornerRadius: 20
                )
            )
            .rasterize()
    }
}

struct HomeSearchBarState {
    static var frame: CGRect = CGRect()

    // add a little padding for fat fingers
    static let padding: CGFloat = 10
    
    static func isWithin(_ valueY: CGFloat) -> Bool {
        return valueY >= HomeSearchBarState.frame.minY - padding
            && valueY <= HomeSearchBarState.frame.maxY + padding
    }
    
    static func isBelow(_ valueY: CGFloat) -> Bool {
        return valueY >= HomeSearchBarState.frame.maxY - padding
    }
}


#if DEBUG
struct HomeMainView_Previews: PreviewProvider {
    static var previews: some View {
        HomeMainView()
            .offset(y: 100)
            .embedInAppEnvironment() // Mocks.homeSearchedPho
    }
}
#endif

//struct SearchBarBg: View {
//    @Environment(\.colorScheme) var colorScheme
//
//    var width: CGFloat = Screen.width
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
