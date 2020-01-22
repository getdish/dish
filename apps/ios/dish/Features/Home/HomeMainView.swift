import SwiftUI
import Combine

// Combine - Apples reactive library
//   - ObservedObject / ObservableObject

let searchBarHeight: CGFloat = 45

struct BrandBar: View {
    var body: some View {
        VStack {
            Spacer()
            ZStack {
                Color(red: 184 / 255, green: 35 / 255, blue: 35 / 255)
                    .frame(height: Screen.statusBarHeight + 5)
                    .padding(.top, 10)
                
                Image("dish-top")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 120, height: 50)
                    .offset(y: -32)
            }
        }
    }
}

struct HomeMainView: View {
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var keyboard: Keyboard
    @Environment(\.geometry) var appGeometry
    
    //
    // main state of this view and sub-views:
    //
    @ObservedObject var state = homeViewState
    
    @State var wasOnSearchResults = false
    @State var wasOnCamera = false

    var body: some View {
        // ⚠️
        // TODO can we put this somewhere more natural?
        // ⚠️
        self.runSideEffects()
        
        let state = self.state
        let mapHeight = state.mapHeight

        print(" 👀 HomeMainView mapHeight \(mapHeight) animationState \(state.animationState)")

        return GeometryReader { geometry in
            ZStack(alignment: .topLeading) {
                    // non visual
                    Group {
                        // dev helpers
                        PrintGeometryView("HomeMainView")
                        
                        // weird way to set appheight
                        Run {
                            guard let g = self.appGeometry else { return }
                            if state.appHeight != g.size.height {
                                state.setAppHeight(g.size.height)
                            }
                        }
                    }
                
                    // camera
                    ZStack {
                        DishCamera()
                        
                        // cover camera
                        Color.black
                            .animation(.spring())
                            .opacity(state.showCamera ? 0 : 1)
                    }
                
                    
                    Group {
                        // map
                        DishMapView()
                            .frame(height: self.appGeometry?.size.height)
                            .offset(y: state.showCamera ? -Screen.height * 1.2 : 0)
                            .opacity(state.showCamera ? 0 : 1)
                            .animation(.spring(response: 0.8))
                            .rotationEffect(state.showCamera ? .degrees(-10) : .degrees(0))
                        
                        
                        VStack {
                            Spacer()
                            LinearGradient(
                                gradient: Gradient(colors: [Color.black.opacity(0),
                                                            Color.black.opacity(0.55)]),
                                startPoint: .top,
                                endPoint: .bottom
                            )
                                .frame(height: (self.appGeometry?.size.height ?? 0) - state.mapHeight)
                        }
                        
                        // everything above the map
                        TopNavView()
                    }

                    
                    // results
                    HomeMainContent()
                        .animation(.spring(response: 0.38))
                        .offset(y: state.showCamera ? Screen.height : 0)
                    
                    // filters
                    VStack {
                        HomeMainFilterBar()
                        Spacer()
                    }
                    .zIndex(state.showFilters ? 100 : 0)
                    .animation(.spring(response: 0.25))
                    .offset(
                        y: state.showFilters ? 0 : mapHeight + searchBarHeight / 2 + (
                            state.showFiltersAbove ? -100 : 0
                        )
                    )
                        .opacity(state.showCamera ? 0 : 1)
                    
                    // searchbar
                    VStack {
                        GeometryReader { searchBarGeometry -> HomeSearchBar in
                            HomeSearchBarState.frame = searchBarGeometry.frame(in: .global)
                            return HomeSearchBar()
                        }
                        .frame(height: searchBarHeight)
                        Spacer()
                    }
                    .padding(.horizontal, 10)
                    .animation(.spring(response: 1.25), value: state.animationState == .animate)
                    .offset(y:
                        state.showCamera ?
                            mapHeight > Screen.height / 2 ? Screen.height * 2 : -Screen.height * 2 :
                            mapHeight - 23 + state.searchBarYExtra
                    )
                    // searchinput always light
                    .environment(\.colorScheme, .light)
                
//                    BrandBar()
                
                    // CameraControlsOverlay
                    ZStack {
                        VStack {
                            HStack {
                                Spacer()
                                CameraButton(
                                    foregroundColor: state.showCamera ? .white : .black
                                )
                                    .scaleEffect(state.showCamera ? 1 : 0.8)
                                    .offset(
                                        x: state.showCamera ? -Screen.width / 2 + 60 / 2 : -6,
                                        y: state.showCamera ? Screen.fullHeight - 160 : state.mapHeight - 60 / 2
                                )
                                    .animation(Animation.spring(response: 0.8).delay(0.05))
                            }
                            Spacer()
                        }
                        //                            if App.store.state.home.showCamera {
                        //                                CameraBackButton()
                        //                            }
                    }
                
                    // make everything untouchable while dragging
                Color.black.opacity(0.0001)
                        .frame(width: state.dragState == .pager ? Screen.width : 0)
                }
                .clipped() // dont remove fixes bug cant click SearchBar
                .shadow(color: Color.black.opacity(0.25), radius: 20, x: 0, y: 0)
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
                    return
                }
                // why is this off some???
                if HomeSearchBarState.isWithin(value.startLocation.y)
                    || self.state.dragState == .searchbar {
                    // hide keyboard on drag
                    if self.keyboard.state.height > 0 {
                        self.keyboard.hide()
                    }
                    // drag
                    self.state.drag(value.translation.height)
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

struct HomeSearchBarState {
    static var frame: CGRect = CGRect()
    static func isWithin(_ valueY: CGFloat) -> Bool {
        // add a little padding for fat fingers
        let padding: CGFloat = 10
        return valueY >= HomeSearchBarState.frame.minY - padding
            && valueY <= HomeSearchBarState.frame.maxY + padding
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
