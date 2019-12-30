import SwiftUI
import Combine

// used in search results for now...
let cardRowHeight: CGFloat = 140

fileprivate let resistanceYBeforeSnap: CGFloat = 50

class HomeViewState: ObservableObject {
    @Published var appHeight: CGFloat = 0
    @Published var scrollY: CGFloat = 0
    @Published var y: CGFloat = 0
    @Published var searchBarYExtra: CGFloat = 0
    @Published var hasMovedBar = false
    
    var mapInitialHeight: CGFloat { appHeight * 0.3 }
    var mapHeight: CGFloat { return max(mapInitialHeight + y, 100) }
    
    var snapToBottomAt: CGFloat { appHeight * 0.15 }
    var snappedToBottomMapHeight: CGFloat { appHeight - 200 }
    var isSnappedToBottom: Bool { y > snapToBottomAt }
    
    var aboutToSnapToBottomAt: CGFloat { snapToBottomAt - resistanceYBeforeSnap }
    
    func toggleMap() {
        self.snapToBottom(!isSnappedToBottom)
    }
    
    private var startDragAt: CGFloat = 0
    
    func drag(_ dragYInput: CGFloat) {
        // TODO we can reset this back to false in some cases for better UX
        self.hasMovedBar = true
        
        // prevent dragging too far up if not at bottom
        let dragY = !isSnappedToBottom ? max(-120, dragYInput) : dragYInput
        
        // remember where we started
        if HomeDragLock.state != .searchbar {
            self.startDragAt = y
            HomeDragLock.setLock(.searchbar)
        }
        
        var y = self.startDragAt + (
            // add resistance if snapped to bottom
            isSnappedToBottom ? dragY * 0.25 : dragY
        )
        
        // resistance before snapping down
        let aboutToSnapToBottom = y >= aboutToSnapToBottomAt && !isSnappedToBottom
        if aboutToSnapToBottom {
            let diff = self.startDragAt + dragY - aboutToSnapToBottomAt
            y = aboutToSnapToBottomAt + diff * 0.25
        }
        
        let wasSnappedToBottom = isSnappedToBottom
        self.y = y
        
        // searchbar moves faster during resistance before snap
        if aboutToSnapToBottom {
            self.searchBarYExtra = y - aboutToSnapToBottomAt
        } else if isSnappedToBottom {
            self.searchBarYExtra = dragY * 0.25
        }
        
        let willSnapUp = -dragY > snapToBottomAt
        let willSnapDown = !wasSnappedToBottom && isSnappedToBottom
        if willSnapDown {
            self.snapToBottom(true)
        } else if willSnapUp {
            self.snapToBottom(false)
        }
    }
    
    func finishDrag(_ value: DragGesture.Value) {
        if isSnappedToBottom {
            self.snapToBottom()
        }
        // attempt to have it "continue" from your drag a bit, feels slow
//        withAnimation(.spring(response: 0.2222)) {
//            self.y = self.y + value.predictedEndTranslation.height / 2
//        }
        if !isSnappedToBottom && y > aboutToSnapToBottomAt {
            withAnimation(.spring()) {
                self.y = aboutToSnapToBottomAt
            }
        }
        if searchBarYExtra != 0 {
            withAnimation(.spring()) {
                self.searchBarYExtra = 0
            }
        }
    }
    
    func snapToBottom(_ toBottom: Bool = true) {
        HomeDragLock.setLock(.off)
        withAnimation(.spring()) {
            self.searchBarYExtra = 0
            if toBottom {
                self.y = snappedToBottomMapHeight - mapInitialHeight
            } else {
                self.y = snapToBottomAt - resistanceYBeforeSnap
            }
        }
    }
    
    func animateTo(_ y: CGFloat) {
        if self.y == y {
            return
        }
        withAnimation(.spring()) {
            self.y = y
        }
    }
    
    func resetAfterKeyboardHide() {
        if !self.hasMovedBar && self.y != 0 && appStore.state.home.search == "" {
            self.animateTo(0)
        }
    }
}

fileprivate let homeViewState = HomeViewState()

struct HomeSearchBarState {
    static var frame: CGRect = CGRect()
    
    static func isWithin(_ valueY: CGFloat) -> Bool {
        return valueY >= HomeSearchBarState.frame.minY && valueY <= HomeSearchBarState.frame.maxY
    }
}

struct HomeMainView: View {
    @EnvironmentObject var keyboard: Keyboard
    @EnvironmentObject var store: AppStore
    @Environment(\.geometry) var appGeometry
    @ObservedObject var state = homeViewState
    
    private var cancellables: Set<AnyCancellable> = []
    
//    init() {
//        self.keyboard.$state.map { keyboard in
//            DispatchQueue.main.async {
//                // TODO escaping closure mutating
////                if keyboard.height > 0 {
////                    self.state.animateTo(-self.appGeometry!.size.height * 0.1)
////                } else {
////                    self.state.resetAfterKeyboardHide()
////                }
//            }
//        }
//        .sink {}
//        .store(in: &cancellables)
//    }
    
    var body: some View {
        print("render HomeMainView")
        
        // pushed map below the border radius of the bottomdrawer
        let isOnSearchResults = Selectors.home.isOnSearchResults()
        let state = self.state
        let mapHeight = state.mapHeight
        
        // TODO why do this in body
        if isOnSearchResults && HomeDragLock.state == .idle {
            DispatchQueue.main.async {
                // animate to higher
                self.state.animateTo(-50)
            }
        }
        
        return GeometryReader { geometry in
            ZStack {
                // weird way to set appheight
                Color.black
                    .onAppear {
                        if let g = self.appGeometry {
                            state.appHeight = g.size.height
                        }
                }
                
                VStack {
                    ZStack {
                        DishMapView(
                            width: geometry.size.width,
                            height: Screen.height
                        )
                    }
                    .frame(height: mapHeight)
                    .cornerRadius(20)
                    .clipped()
                    .animation(.spring(response: 0.3333))
                    
                    Spacer()
                }
                
                // everything below the map
                ZStack {
                    VStack {
                        Spacer()
                            .frame(height: mapHeight - cardRowHeight)
                        
                        HomeMainContent(
                            mapHeight: mapHeight,
                            isHorizontal: self.state.isSnappedToBottom
                        )
                            .transition(AnyTransition.offset())
                    }
                    // putting this animation with the above transition breaks, keeping it outside works...
                    // for some reason this seems to slow down clicking on toggle button
                        .animation(HomeDragLock.state == .idle ? .none : .spring(response: 0.3333))
                    
                    VStack {
                        Spacer().frame(height: mapHeight + 31)
                        
                        // filters
                        HomeMainFilters()
                        .animation(.spring(response: 0.3333))
                        
                        Spacer()
                    }
                    .offset(y: isOnSearchResults ? -100 : 0)
                    .opacity(isOnSearchResults ? 0 : 1)
                    
                    // keyboard dismiss
                    if self.keyboard.state.height > 0 {
                       Color.black.opacity(0.0001)
                        .onTapGesture {
                            self.keyboard.hide()
                        }
                    }
                    
                    VStack {
                        GeometryReader { searchBarGeometry -> HomeSearchBar in
                            HomeSearchBarState.frame = searchBarGeometry.frame(in: .global)
                            return HomeSearchBar()
                        }
                        .frame(height: 45)
                        
                        Spacer()
                    }
                    .padding(.horizontal, 10)
                    .offset(y: mapHeight - 23 + state.searchBarYExtra)
                        //                    .animation(dragState != .on ? .spring() : .none)
                        // searchinput always light
                        .environment(\.colorScheme, .light)
                }
                    // everything below map is always dark
                    .environment(\.colorScheme, .dark)
            }
            .clipped()
            .shadow(color: Color.black.opacity(0.25), radius: 20, x: 0, y: 0)
            .simultaneousGesture(
                DragGesture(minimumDistance: 10)
                    .onChanged { value in
                        if [.off, .pager].contains(HomeDragLock.state) {
                            return
                        }
                        // why is this off 80???
                        if HomeSearchBarState.isWithin(value.startLocation.y - 40) || HomeDragLock.state == .searchbar {
                            // hide keyboard on drag
                            if self.keyboard.state.height > 0 {
                                self.keyboard.hide()
                            }
                            // drag
                            self.state.drag(value.translation.height)
                        }
                }
                .onEnded { value in
                    if [.idle, .searchbar].contains(HomeDragLock.state) {
                        self.state.finishDrag(value)
                    }
                    HomeDragLock.setLock(.idle)
                }
            )
        }
        .environmentObject(self.state)
    }
}

struct DishBrowseCard: View {
    var dish: DishItem
    var body: some View {
        FeatureCard(dish: dish, aspectRatio: 1.4)
            .cornerRadius(14)
    }
}

#if DEBUG
struct HomeMainView_Previews: PreviewProvider {
    static var previews: some View {
        HomeMainView()
            .embedInAppEnvironment(Mocks.homeSearchedPho)
    }
}
#endif
