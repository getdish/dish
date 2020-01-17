import SwiftUI
import Combine

let searchBarHeight: CGFloat = 45

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

        print("render HomeMainView")
        print("  - mapHeight \(mapHeight)")
        print("  - animationState \(state.animationState)")

        return GeometryReader { geometry in
            ZStack(alignment: .topLeading) {
                    // weird way to set appheight
                    Color.black
                        .onAppear {
                            if let g = self.appGeometry {
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

                    // map
                    DishMapView()
                
                    PrintGeometryView("HomeMainView")


                    // everything above the map
                    ZStack {
                        TopNavView()
                        
                        // results
                        HomeMainContent()
//                            .animation(.spring(), value: state.animationState == .animate)
                            .animation(.spring(response: 0.38))
                            .offset(y: state.showCamera ? Screen.height : 0)
                        
                        BottomNav()
                        
                        // filters
                        VStack {
                            HomeMainFilters()
                            Spacer()
                        }
                        .offset(
                            y: mapHeight + searchBarHeight / 2 - 4 + (
                                state.showFiltersAbove ? -100 : 0
                            )
                        )
                        .opacity(state.showCamera ? 0 : 1)
                        .animation(.spring(response: 0.25), value: state.animationState == .animate)

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
                        .animation(.spring(), value: state.animationState == .animate)
                        .offset(y:
                            state.showCamera ?
                                mapHeight > Screen.height / 2 ? Screen.height * 2 : -Screen.height * 2 :
                                mapHeight - 23 + state.searchBarYExtra
                        )
                        // searchinput always light
                        .environment(\.colorScheme, .light)
                    }  // end ZStack  "everything above map"
                    .environment(\.colorScheme, .dark)
                
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
            DispatchQueue.main.async {
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
            DispatchQueue.main.async {
                self.wasOnCamera = isOnCamera
                self.state.setShowCamera(isOnCamera)
            }
        }
        
        
        if let height = appGeometry?.size.height {
            if height != state.appHeight {
                DispatchQueue.main.async {
                    self.state.setAppHeight(height)
                }
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
