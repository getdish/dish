import SwiftUI
import Combine

// used in search results for now...
let cardRowHeight: CGFloat = 140

fileprivate let topNavHeight: CGFloat = 45
fileprivate let hideTopNavAtVal: CGFloat = 160 + Screen.statusBarHeight
fileprivate let searchBarHeight: CGFloat = 45
fileprivate let resistanceYBeforeSnap: CGFloat = 48

// need enum animateStatus = { .will, .is, .idle }
// then on idle we can apply .spring()

class HomeViewState: ObservableObject {
    enum HomeDragState {
        case idle, off, pager, searchbar
    }
    
    // note:
    // idle == nothing
    // animate == .animation()
    // controlled = nothing (but we are animating manually using withAnimation())
    enum HomeAnimationState {
        case idle, controlled, animate
    }
    
    enum HomeScrollState {
        case none, some, more
    }
    
    @Published private(set) var appHeight: CGFloat = Screen.height
    @Published private(set) var scrollY: CGFloat = 0
    @Published private(set) var y: CGFloat = 0
    @Published private(set) var searchBarYExtra: CGFloat = 0
    @Published private(set) var hasScrolled: HomeScrollState = .none
    @Published private(set) var hasMovedBar = false
    @Published private(set) var shouldAnimateCards = false
    @Published private(set) var dragState: HomeDragState = .idle
    @Published private(set) var animationState: HomeAnimationState = .idle
    @Published private(set) var showCamera = false
    
    private var cancelAnimation: AnyCancellable? = nil

    // keyboard
    @Published var keyboardHeight: CGFloat = 0
    private var cancels: Set<AnyCancellable> = []
    private var keyboard = Keyboard()
    private var lastKeyboardAdjustY: CGFloat = 0

    init() {
        // start map height at just above snapToBottomAt
        self.$appHeight
            .debounce(for: .milliseconds(200), scheduler: App.defaultQueue)
            .sink { val in
                if !self.isSnappedToTop && !self.isSnappedToBottom {
                    DispatchQueue.main.async {
                        self.y = self.snapToBottomAt - 1
                    }
                }
            }
            .store(in: &cancels)
        
        self.keyboard.$state
            .map { $0.height }
            .removeDuplicates()
            .assign(to: \.keyboardHeight, on: self)
            .store(in: &cancels)
        
        self.keyboard.$state.map { $0.height }
            .removeDuplicates()
            .sink { val in
                // set animating while keyboard animates
                // prevents filters jumping up/down while focusing input
                self.setAnimationState(.controlled, 350)
            }
            .store(in: &cancels)

        self.keyboard.$state
            .map { $0.height }
            .removeDuplicates()
            .sink { height in
                let isOpen = height > 0
                
                // disable top nav when keyboard open
                App.store.send(.setDisableTopNav(isOpen))
                
                // map up/down on keyboard open/close
                if !self.isSnappedToBottom {
                    self.animate {
                        if isOpen {
                            let str = max(0, 1 - (self.snapToBottomAt - self.y) / self.snapToBottomAt)
                            let amt = 170 * str
                            self.y -= amt
                            self.lastKeyboardAdjustY = amt
                        } else {
                            self.y += self.lastKeyboardAdjustY
                        }
                    }
                }
                
            }
            .store(in: &cancels)
        
        let started = Date()
        self.$scrollY
            .throttle(for: 0.1, scheduler: App.defaultQueue, latest: true)
            .removeDuplicates()
            .sink { y in
                if Date().timeIntervalSince(started) > 1 {
                    let next: HomeViewState.HomeScrollState = (
                        y > 60 ? .more : y > 30 ? .some : .none
                    )
                    if next != self.hasScrolled {
                        print("scroll scroll \(y)")
                        self.animate(state: .animate) {
                            self.hasScrolled = next
                        }
                    }
                }
            }.store(in: &cancels)
    }
    
    // note: setDragState/setAnimationSate should be only way to mutate state
    
    func setDragState(_ next: HomeDragState) {
        log.info()
        self.dragState = next
    }
    
    func setAnimationState(_ next: HomeAnimationState, _ duration: Int = 0) {
        DispatchQueue.main.async {
            self.animationState = next
            // cancel last controlled animation
            if next != .idle,
                let handle = self.cancelAnimation {
                handle.cancel()
            }
            // allow timeout
            if duration > 0 {
                var active = true
                self.cancelAnimation = AnyCancellable {
                    active = false
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(300)) {
                    if active {
                        self.setAnimationState(.idle)
                        self.cancelAnimation = nil
                    }
                }
            }
        }
    }
    
    func animate(_ animation: Animation? = .spring(), state: HomeAnimationState = .controlled, duration: Int = 400, _ body: @escaping () -> Void) {
        log.info()
        DispatchQueue.main.async {
            self.setAnimationState(state, duration)
            DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(10)) {
                withAnimation(animation) {
                    body()
                }
            }
        }
    }
    
    var showFiltersAbove: Bool {
        if y > snapToBottomAt - 1 { return false }
        if mapHeight < 190 { return false }
        return hasScrolled != .none
    }
    
    let hideTopNavAt: CGFloat = hideTopNavAtVal

    let mapMinHeight: CGFloat = max(
        hideTopNavAtVal - 1,
        Screen.statusBarHeight + searchBarHeight / 2 + topNavHeight + 90
    )

    var mapInitialHeight: CGFloat { appHeight * 0.3 }
    
    var mapMaxHeight: CGFloat { appHeight - keyboardHeight - searchBarHeight }
    
    
    var scrollRevealY: CGFloat {
        if hasScrolled == .more {
            return 40
        }
        return 0
    }
    
    var mapHeight: CGFloat {
        return min(
            mapMaxHeight, max(
                mapInitialHeight + y - scrollRevealY, mapMinHeight
            )
        )
    }

    var snapToBottomAt: CGFloat { appHeight * 0.23 }
    var snappedToBottomMapHeight: CGFloat { appHeight - 190 }
    var isSnappedToBottom: Bool { y > snapToBottomAt }
    var wasSnappedToBottom = false
    var aboutToSnapToBottomAt: CGFloat { snapToBottomAt - resistanceYBeforeSnap }
    
    var isAboutToSnap: Bool {
        if y > aboutToSnapToBottomAt { return true }
        return false
    }

    func toggleMap() {
        log.info()
        self.snapToBottom(!isSnappedToBottom)
    }

    private var startDragAt: CGFloat = 0
    private var lastDragY: CGFloat = 0

    func drag(_ dragY: CGFloat) {
        if dragState == .pager { return }
        if lastDragY == dragY { return }
        lastDragY = dragY

        log.info(dragY)
        
        // TODO we can reset this back to false in some cases for better UX
        self.hasMovedBar = true

        // remember where we started
        if dragState != .searchbar {
            self.startDragAt = y
            self.setDragState(.searchbar)
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

        if y.rounded() == self.y.rounded() {
            log.info("ignore same values")
            return
        }
        
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
            let distanceUntilSnapUp = appHeight * 0.2
            let willSnapUp = -dragY > distanceUntilSnapUp
            if willSnapUp {
                self.snapToBottom(false)
            }
        }
    }

    func finishDrag(_ value: DragGesture.Value) {
        if dragState == .pager { return }
        log.info()
        
        self.animate {
            if self.isSnappedToBottom {
                self.snapToBottom()
            } else if self.y > self.aboutToSnapToBottomAt {
                self.y = self.aboutToSnapToBottomAt
            }
            if self.searchBarYExtra != 0 {
                self.searchBarYExtra = 0
            }
            // attempt to have it "continue" from your drag a bit, feels slow
            //        withAnimation(.spring(response: 0.2222)) {
            //            self.y = self.y + value.predictedEndTranslation.height / 2
            //        }
        }
    }

    func snapToBottom(_ toBottom: Bool = true) {
        log.info()
        // prevent dragging after snap
        self.setDragState(.off)
        self.animate {
            self.scrollY = 0
            self.searchBarYExtra = 0
            if toBottom {
                self.y = self.snappedToBottomMapHeight - self.mapInitialHeight
            } else {
                self.y = self.snapToBottomAt - resistanceYBeforeSnap
            }
        }
    }

    var mapSnappedToTopHeight: CGFloat {
        self.mapMinHeight - self.mapInitialHeight
    }

    var isSnappedToTop: Bool {
        self.y == mapSnappedToTopHeight
    }

    func snapToTop() {
        log.info()
        if !isSnappedToTop {
//            self.hasMovedBar = false
            self.animate {
                self.y = self.mapMinHeight - self.mapInitialHeight
            }
        }
    }

    func animateTo(_ y: CGFloat) {
        if self.y == y { return }
        log.info()
        self.animate {
            self.y = y
        }
    }

    func resetAfterKeyboardHide() {
        if !self.hasMovedBar && self.y != 0 && App.store.state.home.state.last!.search == "" {
            log.info()
            self.animateTo(0)
        }
    }

    func setScrollY(_ scrollY: CGFloat) {
        if dragState != .idle { return }
        if animationState != .idle { return }
        let y = max(0, min(100, scrollY)).rounded()
        if y != self.scrollY {
            self.scrollY = y
        }
    }
    
    func moveToSearchResults() {
        if isSnappedToBottom { return }
        if dragState == .idle && y >= 0 {
            log.info()
            self.animateTo(y - 80)
        }
    }
    
    func setAppHeight(_ val: CGFloat) {
        log.info()
        self.appHeight = val
    }
    
    func setShowCamera(_ val: Bool) {
        self.animate(state: .animate) {
           self.showCamera = val
        }
    }
}

let homeViewState = HomeViewState()

struct HomeSearchBarState {
    static var frame: CGRect = CGRect()

    static func isWithin(_ valueY: CGFloat) -> Bool {
        // add a little padding for fat fingers
        let padding: CGFloat = 10
        return valueY >= HomeSearchBarState.frame.minY - padding
            && valueY <= HomeSearchBarState.frame.maxY + padding
    }
}

struct HomeMainView: View {
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var keyboard: Keyboard
    @Environment(\.geometry) var appGeometry
    @ObservedObject var state = homeViewState
    
    @State var wasOnSearchResults = false
    @State var wasOnCamera = false
    
    func runSideEffects() {
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

    var body: some View {
        // ⚠️
        // TODO can we put this somewhere more natural?
        // ⚠️
        self.runSideEffects()
        
        let state = self.state
        let isOnSearchResults = Selectors.home.isOnSearchResults()
        let mapHeight = state.mapHeight
        let zoom = mapHeight / 235 + 9.7

        print("render HomeMainView")
        print("  - mapHeight \(mapHeight)")
        print("  - animationState \(state.animationState)")

//        return MagicMove(animate: state.animate) {
        return GeometryReader { geometry in
            ZStack(alignment: .top) {
                    // weird way to set appheight
                    Color.black
                        .onAppear {
                            if let g = self.appGeometry {
                                if state.appHeight != g.size.height {
                                    state.setAppHeight(g.size.height)
                                }
                            }
                    }
                
                    DishCamera()
                        .animation(.spring())
                        .offset(y: state.showCamera ? 0 : -Screen.height)

                    // below the map
                    
                    // main content
                    HomeMainContent(
                        isHorizontal: self.state.isSnappedToBottom
                    )
                    .offset(y: state.showCamera ? Screen.height : 0)
                    .opacity(isOnSearchResults && state.isSnappedToBottom ? 0 : 1)
                    .animation(state.animationState == .animate ? .spring() : .none)

                    // map
                    VStack {
                        ZStack {
//                            Color.red
//                                .cornerRadius(20)
//                                .scaleEffect(mapHeight < 250 ? 0.8 : 1)
//                                .animation(.spring())
                            DishMapView(
                                width: geometry.size.width,
                                height: Screen.height,
                                zoom: zoom
                            )
                            
//                            // keyboard dismiss (above map, below content)
                            if self.keyboard.state.height > 0 {
                                Color.black.opacity(0.2)
                                    .transition(.opacity)
                                    .onTapGesture {
                                        self.keyboard.hide()
                                }
                            }
                        }
                        .frame(height: mapHeight)
                        .cornerRadius(20)
                        .shadow(color: Color.black, radius: 20, x: 0, y: 0)
                        .clipped()
//                        .animation(state.state == .animating ? .none : .spring(response: 0.3333))

                        Spacer()
                    }


                    // everything above the map
                    ZStack {
                        // map search results
                        VStack {
                            DishMapResults()
                            Spacer()
                        }
                        .offset(y: max(100, mapHeight - cardRowHeight - 16))
                        .animation(.spring())
                        .opacity(state.isSnappedToBottom ? 1 : 0)
                        .allowsHitTesting(state.isSnappedToBottom)
                        
                        // filters
                        VStack {
                            HomeMainFilters()
                            Spacer()
                        }
//                        .animation(state.state == .animating ? .none : .spring(response: 0.3333))
                        .offset(y: mapHeight + searchBarHeight / 2 - 4 + (
                            state.showFiltersAbove ? -100 : 0
                        ))
//                        .opacity(isOnSearchResults ? 0 : 1)

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
                        .animation(
                            state.animationState == .animate ? .spring() : .none
                            //                                            state.state == .idle ? .spring(response: 0.25) : .spring(response: 0.1)
                        )
                        .offset(y: mapHeight - 23 + state.searchBarYExtra)
                        // searchinput always light
                        .environment(\.colorScheme, .light)
                    }
                    .environment(\.colorScheme, .dark)
                
                    // make everything untouchable while dragging
                Color.black.opacity(0.0001)
                        .frame(width: state.dragState == .pager ? Screen.width : 0)
                }
                .clipped() // dont remove fixes bug cant click SearchBar
                .shadow(color: Color.black.opacity(0.25), radius: 20, x: 0, y: 0)
                .simultaneousGesture(
                    DragGesture(minimumDistance: 10)
                        .onChanged { value in
                            if [.off, .pager].contains(state.dragState) {
                                return
                            }
                            // why is this off some???
                            if HomeSearchBarState.isWithin(value.startLocation.y - 37) || state.dragState == .searchbar {
                                // hide keyboard on drag
                                if self.keyboard.state.height > 0 {
                                    self.keyboard.hide()
                                }
                                // drag
                                self.state.drag(value.translation.height)
                            }
                    }
                    .onEnded { value in
                        if [.idle, .searchbar].contains(state.dragState) {
                            self.state.finishDrag(value)
                        }
                        self.state.setDragState(.idle)
                    }
                )
            }
            .environmentObject(self.state)
//        }
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
