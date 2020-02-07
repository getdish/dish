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
    
    var body: some View {
        let state = self.state
        let animationState = state.animationState
        let mapHeight = state.mapHeight
        //        let enableSearchBar = [.idle, .off].contains(state.dragState) && state.animationState == .idle
        
        print(" 👀 HomeMainView mapHeight \(mapHeight) animationState \(state.animationState)")
        
        return ZStack(alignment: .topLeading) {
            // Side effects
            Group {
                PrintGeometryView("HomeMainView")
                
                RunOnce(name: "splash animation") {
                    async(100) {
                        self.state.setAnimationState(.idle)
                    }
                }
                
                SideEffect(".store.setAppHeight", condition: { self.appGeometry?.size.height != self.state.appHeight }) {
                    if let height = self.appGeometry?.size.height {
                        self.state.setAppHeight(height)
                    }
                }
                
                SideEffect(".store.moveToSearchResults", condition: { Selectors.home.isOnSearchResults() != self.wasOnSearchResults }) {
                    let val = Selectors.home.isOnSearchResults()
                    self.wasOnSearchResults = val
                    if val {
                        self.state.moveToSearchResults()
                    }
                }
                
                SideEffect(".store.setShowCamera", condition: { App.store.state.home.showCamera != self.wasOnCamera }) {
                    self.wasOnCamera = App.store.state.home.showCamera
                    self.state.setShowCamera(self.wasOnCamera)
                }
            }
            
            // Camera
            if App.enableCamera && animationState != .splash {
                Group {
                    ZStack {
                        DishCamera()
                        
                        // cover camera
                        Color.black
                            .opacity(state.showCamera ? 0 : 1)
                            .animation(.spring())
                    }
                    .frameLimitedToScreen()
                }
            }
            
            // Map
            if App.enableMap {
                ZStack {
                    DishMapView(
                        height: state.mapFullHeight,
                        animate: [.idle].contains(state.dragState)
                            || state.animationState != .idle
                            || state.mapHeight > state.startSnapToBottomAt
                    )
                        .offset(y: state.showCamera
                            ? -Screen.height
                            : -(state.mapFullHeight - mapHeight) / 2 + 25 /* topbar offset */
                    )
                        .opacity(
                            state.showCamera || animationState == .splash ? 0 : 1
                    )
                        .rotationEffect(state.showCamera ? .degrees(-10) : .degrees(0))
                        .animation(.spring(response: 0.8), value: state.animationState == .animate)
                    
                    HomeMapOverlay()
                        .offset(y: mapHeight - 20)
                }
                    .frame(height: state.appHeight)
                    .clipped()
            }
            
            // Content
            if App.enableContent && animationState != .splash {
                ZStack {
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
                .transition(.opacity)
            }
            
            // Search
            ZStack {
                VStack {
                    HomeSearchBar(
                        showInput: state.animationState == .idle
                    )
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
            
            
            // Camera Controls
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
            .environmentObject(self.state)
    }
    
    var dragGesture: _EndedGesture<_ChangedGesture<DragGesture>> {
        return DragGesture(minimumDistance: 10)
            .onChanged { value in
                if [.off, .pager].contains(self.state.dragState) {
                    //                    print("☕️ ignore \(self.state.dragState)")
                    return
                }
                
                let isAlreadyDragging = self.state.dragState == .searchbar
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
            if [.idle, .searchbar].contains(self.state.dragState) {
                self.state.finishDrag(value)
            }
            self.state.setDragState(.idle)
        }
    }
}

struct HomeMapOverlay: View {
    var body: some View {
        ZStack {
            HomeMapBackgroundGradient()
            HomeMapMask()
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
        }
    }
    
    struct HomeMapMask: View {
        var body: some View {
            Color.black.opacity(0.4)
                .clipShape(
                    topCornerMask(
                        width: Screen.width,
                        height: Screen.fullHeight,
                        cornerRadius: 25
                    )
            )
            .rasterize()
        }
        //    LinearGradient(
        //        gradient: Gradient(
        //        colors: [
        //        Color(white: 0).opacity(0.7), Color(white: 0).opacity(0), Color.black.opacity(0)
        //        ]
        //        ),
        //        startPoint: .top,
        //        endPoint: .bottom
        //    )
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
