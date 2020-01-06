import SwiftUI
import Combine

// used in search results for now...
let cardRowHeight: CGFloat = 140

fileprivate let topNavHeight: CGFloat = 45
fileprivate let searchBarHeight: CGFloat = 45
fileprivate let resistanceYBeforeSnap: CGFloat = 55

// need enum animateStatus = { .will, .is, .idle }
// then on idle we can apply .spring()

class HomeViewState: ObservableObject {
    @Published var appHeight: CGFloat = 0
    @Published var scrollY: CGFloat = 0
    @Published var y: CGFloat = 0
    @Published var searchBarYExtra: CGFloat = 0
    @Published var hasMovedBar = false
    @Published var animate = false
    
    // keyboard
    @Published var keyboardHeight: CGFloat = 0
    private var cancellables: Set<AnyCancellable> = []
    private var keyboard = Keyboard()
    
    init() {
        self.keyboard.$state
            .map { $0.height }
            .assign(to: \.keyboardHeight, on: self)
            .store(in: &cancellables)
    }
    
    let mapMinHeight: CGFloat = Screen.statusBarHeight + searchBarHeight / 2 + topNavHeight + 40
    var mapMaxHeight: CGFloat { appHeight - keyboardHeight - searchBarHeight - 20 }
    var mapInitialHeight: CGFloat { appHeight * 0.3 }
    
    var mapHeight: CGFloat {
        //        let scrollYExtra: CGFloat = self.isSnappedToBottom ? 0 : self.scrollY
        //         - scrollYExtra
        return min(mapMaxHeight, max(mapInitialHeight + y, mapMinHeight))
    }
    
    var snapToBottomAt: CGFloat { appHeight * 0.2 }
    var snappedToBottomMapHeight: CGFloat { appHeight - 200 }
    var isSnappedToBottom: Bool { y > snapToBottomAt }
    var wasSnappedToBottom = false
    
    var aboutToSnapToBottomAt: CGFloat { snapToBottomAt - resistanceYBeforeSnap }
    
    func toggleMap() {
        log.verbose("test")
        self.snapToBottom(!isSnappedToBottom)
    }
    
    private var startDragAt: CGFloat = 0
    
    func drag(_ dragY: CGFloat) {
        log.verbose("test")
        // TODO we can reset this back to false in some cases for better UX
        self.hasMovedBar = true
        
        // remember where we started
        if HomeDragLock.state != .searchbar {
            self.startDragAt = y
            HomeDragLock.setLock(.searchbar)
        }
        
        var y = self.startDragAt + (
            // add resistance if snapped to bottom
            isSnappedToBottom ? dragY * 0.2 : dragY
        )
        
        // resistance before snapping down
        let aboutToSnapToBottom = y >= aboutToSnapToBottomAt && !isSnappedToBottom
        if aboutToSnapToBottom {
            let diff = self.startDragAt + dragY - aboutToSnapToBottomAt
            y = aboutToSnapToBottomAt + diff * 0.2
        }
        
        // store wasSnappedToBottom before changing y
        let wasSnappedToBottom = isSnappedToBottom
        
        self.y = y
        
        // while snapped, have searchbar move differently
        // searchbar moves faster during resistance before snap
        if aboutToSnapToBottom {
            self.searchBarYExtra = y - aboutToSnapToBottomAt
        } else if isSnappedToBottom {
            self.searchBarYExtra = dragY * 0.25
        }
        
        // snap to bottom/back logic
        let willSnapDown = !wasSnappedToBottom && isSnappedToBottom
        if willSnapDown {
            self.snapToBottom(true)
        } else if wasSnappedToBottom {
            // distance before snapping back up
            let willSnapUp = -dragY > appHeight * 0.25
            if willSnapUp {
                self.snapToBottom(false)
            }
        }
    }
    
    func finishDrag(_ value: DragGesture.Value) {
        log.verbose("test")
        if isSnappedToBottom {
            self.snapToBottom()
        }
        if !isSnappedToBottom && y > aboutToSnapToBottomAt {
            withAnimation(.spring()) {
                self.y = aboutToSnapToBottomAt
                self.searchBarYExtra = 0
            }
        } else {
            if searchBarYExtra != 0 {
                withAnimation(.spring()) {
                    self.searchBarYExtra = 0
                }
            }
        }
        // attempt to have it "continue" from your drag a bit, feels slow
        //        withAnimation(.spring(response: 0.2222)) {
        //            self.y = self.y + value.predictedEndTranslation.height / 2
        //        }
    }
    
    func snapToBottom(_ toBottom: Bool = true) {
        log.verbose("test")
        HomeDragLock.setLock(.off)
        self.animateCards()
        withAnimation(.spring()) {
            self.scrollY = 0
            self.searchBarYExtra = 0
            if toBottom {
                self.y = snappedToBottomMapHeight - mapInitialHeight
            } else {
                self.y = snapToBottomAt - resistanceYBeforeSnap
            }
        }
    }
    
    func animateCards() {
        log.verbose("test")
        self.animate = true
        DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(300)) {
            self.animate = false
        }
    }
    
    var mapSnappedToTopHeight: CGFloat {
        self.mapMinHeight - self.mapInitialHeight
    }
    
    var isSnappedToTop: Bool {
        self.y == mapSnappedToTopHeight
    }
    
    func snapToTop() {
        log.verbose("test")
        if !isSnappedToTop {
            //        self.hasMovedBar = false
            withAnimation(.spring()) {
                self.scrollY = 0
                self.y = self.mapMinHeight - self.mapInitialHeight
            }
        }
    }
    
    func animateTo(_ y: CGFloat) {
        log.verbose("test")
        self.scrollY = 0
        if self.y == y {
            return
        }
        withAnimation(.spring()) {
            self.y = y
        }
    }
    
    func resetAfterKeyboardHide() {
        log.verbose("test")
        if !self.hasMovedBar && self.y != 0 && appStore.state.home.search == "" {
            self.animateTo(0)
        }
    }
    
    func setScrollY(_ scrollY: CGFloat) {
        log.verbose("test")
        print("disabled scroll y some bugs")
//        if HomeDragLock.state != .idle {
//            return
//        }
//        let y = max(0, min(100, scrollY)).rounded()
//        if y != self.scrollY {
//            self.scrollY = y
//        }
    }
}

fileprivate let homeViewState = HomeViewState()

struct HomeSearchBarState {
    static var frame: CGRect = CGRect()
    
    static func isWithin(_ valueY: CGFloat) -> Bool {
        return valueY >= HomeSearchBarState.frame.minY && valueY <= HomeSearchBarState.frame.maxY
    }
}

// TODO
// We need to have an Effect from appstate reducer that then has effects onto HomeState
//  1. Keyboard see below init() commented out
//  2. We need to reset hasMovedBar = false when we change certain things

struct HomeMainView: View {
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var keyboard: Keyboard
    @Environment(\.geometry) var appGeometry
    @ObservedObject var state = homeViewState
    
    var body: some View {
        // pushed map below the border radius of the bottomdrawer
        let isOnSearchResults = Selectors.home.isOnSearchResults()
        let state = self.state
        let mapHeight = state.mapHeight
        
        print("render HomeMainView -- mapHeight \(mapHeight) state.scrollY \(state.scrollY)")
        
        // TODO why do this in body
        if isOnSearchResults && HomeDragLock.state == .idle {
            DispatchQueue.main.async {
                self.state.snapToTop()
            }
        }
        
        let zoom = abs(state.y) / 20
        print("zoom \(zoom)")
        
        return MagicMove(animate: state.animate) {
            GeometryReader { geometry in
                ZStack {
                    // weird way to set appheight
                    Color.black
                        .onAppear {
                            if let g = self.appGeometry {
                                if state.appHeight != g.size.height {
                                    state.appHeight = g.size.height
                                }
                            }
                    }
                    
                    VStack {
                        ZStack {
                            DishMapView(
                                width: geometry.size.width,
                                height: Screen.height
                                //                            zoom: zoom
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
                                isHorizontal: self.state.isSnappedToBottom
                            )
                                //                            .frame(height: (self.appGeometry?.size.height ?? 0) - (mapHeight - cardRowHeight) + 100)
                                .transition(AnyTransition.offset())
                            //                            .offset(y: 100 - state.scrollY)
                        }
                            // putting this animation with the above transition breaks, keeping it outside works...
                            // for some reason this seems to slow down clicking on toggle button
                            .animation(HomeDragLock.state == .idle ? .none : .spring(response: 0.3333))
                        
                        VStack {
                            Spacer().frame(height: mapHeight + 34)
                            
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
                            .frame(height: searchBarHeight)
                            
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
}

#if DEBUG
struct HomeMainView_Previews: PreviewProvider {
    static var previews: some View {
        HomeMainView()
            .embedInAppEnvironment(Mocks.homeSearchedPho)
    }
}
#endif
