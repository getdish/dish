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
    enum HomeAnimationState {
        case idle, controlled, uncontrolled
    }
    
    @Published private(set) var appHeight: CGFloat = Screen.height
    @Published private(set) var scrollY: CGFloat = 0
    @Published private(set) var y: CGFloat = 0
    @Published private(set) var searchBarYExtra: CGFloat = 0
    @Published private(set) var hasMovedBar = false
    @Published private(set) var shouldAnimateCards = false
    @Published private(set) var hasScrolledSome = false
    @Published private(set) var dragState: HomeDragState = .idle
    @Published private(set) var animationState: HomeAnimationState = .idle
    
    var scrollRevealY: CGFloat {
        mapHeight > 120 ? 100 : 0
    }

    // keyboard
    @Published var keyboardHeight: CGFloat = 0
    private var cancellables: Set<AnyCancellable> = []
    private var keyboard = Keyboard()

    init() {
        self.keyboard.$state
            .map { $0.height }
            .assign(to: \.keyboardHeight, on: self)
            .store(in: &cancellables)

        self.keyboard.$state
            .map { $0.height }
            .sink { height in
                let isOpen = height > 0
                
                // disable top nav when keyboard open
                appStore.send(.setDisableTopNav(isOpen))
                
                // map up/down on keyboard open/close
                if !self.isSnappedToBottom {
                    self.animate {
                        self.y += isOpen ? -170 : 170
                    }
                }
                
            }
            .store(in: &cancellables)
        
        let started = Date()
        self.$scrollY
            .throttle(for: 0.1, scheduler: q, latest: true)
            .sink { y in
                print("\(Date().timeIntervalSince(started))")
                if Date().timeIntervalSince(started) > 1 {
                    self.animate(state: .uncontrolled) {
                        print("scroll scroll \(y)")
                        if y > 20 {
                            self.hasScrolledSome = true
                        } else {
                            self.hasScrolledSome = false
                        }
                    }
                }
            }.store(in: &cancellables)
    }
    
    // note: setDragState/setAnimationSate should be only way to mutate state
    
    func setDragState(_ next: HomeDragState) {
        log.info()
        self.dragState = next
    }
    
    func setAnimationState(_ next: HomeAnimationState) {
        log.info()
        self.animationState = next
        // cancel last controlled animation
        if next != .controlled,
            let handle = self.cancelAnimation {
            handle.cancel()
        }
    }
    
    private var cancelAnimation: AnyCancellable? = nil
    func animate(_ animation: Animation? = .spring(), state: HomeAnimationState = .controlled, _ body: @escaping () -> Void) {
        log.info()
        var shouldEnd = true
        self.cancelAnimation = AnyCancellable {
            shouldEnd = false
        }
//        self.setAnimationState(state)
        DispatchQueue.main.async {
            withAnimation(animation) {
                body()
            }
            // TODO we need a way to know when .spring() ends...
            DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(400)) {
                if shouldEnd {
                    self.setAnimationState(.idle)
                }
            }
        }
    }
    
    var showFiltersAbove: Bool {
        if y > snapToBottomAt - 1 { return false }
        if mapHeight < 190 { return false }
        return hasScrolledSome
    }
    
    let hideTopNavAt: CGFloat = hideTopNavAtVal

    let mapMinHeight: CGFloat = max(
        hideTopNavAtVal - 1,
        Screen.statusBarHeight + searchBarHeight / 2 + topNavHeight + 90
    )
    var mapInitialHeight: CGFloat { appHeight * 0.3 }
    
    var mapMaxHeight: CGFloat { appHeight - keyboardHeight - searchBarHeight }

    var mapHeight: CGFloat {
        return min(mapMaxHeight, max(mapInitialHeight + y, mapMinHeight))
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

    func drag(_ dragY: CGFloat) {
        if dragState == .pager { return }
        log.info()
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
        log.info()
        if !self.hasMovedBar && self.y != 0 && appStore.state.home.state.last!.search == "" {
            self.animateTo(0)
        }
    }

    func setScrollY(_ scrollY: CGFloat) {
        if dragState != .idle { return }
//        log.info()
        let y = max(0, min(100, scrollY)).rounded()
        if y != self.scrollY {
            self.scrollY = y
        }
    }
    
    func moveToSearchResults() {
        log.info()
        if dragState == .idle && y >= 0 {
            self.animateTo(y - 80)
        }
    }
    
    func setAppHeight(_ val: CGFloat) {
        log.info()
        self.appHeight = val
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

    var body: some View {
        // pushed map below the border radius of the bottomdrawer
        let isOnSearchResults = Selectors.home.isOnSearchResults()
        let isMovingToSearchResults = isOnSearchResults && !wasOnSearchResults
        if isMovingToSearchResults {
            state.moveToSearchResults()
        }
        
        // reset back
        if isOnSearchResults != wasOnSearchResults {
            DispatchQueue.main.async {
                self.wasOnSearchResults = isOnSearchResults
            }
        }
        
        
        if let height = appGeometry?.size.height {
            if height != state.appHeight {
                DispatchQueue.main.async {
                    self.state.setAppHeight(height)
                }
            }
        }
        
        let state = self.state
        let scrollRevealY = state.scrollRevealY
        let shouldAvoidScrollReveal = state.mapHeight < scrollRevealY + 100
        let mapHeightScrollReveal: CGFloat = shouldAvoidScrollReveal ? 0 :
            state.scrollY > scrollRevealY / 2 ?
                -35 : 0
        let mapHeight = state.mapHeight + mapHeightScrollReveal
        let zoom = mapHeight / 235 + 9.7

        print("render HomeMainView -- mapHeight \(mapHeight) y \(state.y)")

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
                    
                // indicator for snap point?
//                    Color.white
//                        .frame(height: 1)
//                        .animation(.spring())
//                        .opacity(state.y > state.aboutToSnapToBottomAt - 70 ? 0.2 : 0.0)
//                        .offset(y: state.aboutToSnapToBottomAt + state.mapInitialHeight)
                    
                    // below the map
                    
                    // main content
                    HomeMainContent(
                        isHorizontal: self.state.isSnappedToBottom
                    )

                    // map
                    VStack {
                        ZStack {
                            Color.red
//                            DishMapView(
//                                width: geometry.size.width,
//                                height: Screen.height,
//                                zoom: zoom
//                            )
                            
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
                        .clipped()
//                        .animation(state.state == .animating ? .none : .spring(response: 0.3333))

                        Spacer()
                    }


                    // everything above the map
                    ZStack {
                        // map search results
                        VStack {
                            HomeCardsRow()
                            Spacer()
                        }
                        .frame(width: self.appGeometry?.size.width, height: self.appGeometry?.size.height)
                        .offset(y: max(100, mapHeight - cardRowHeight - 16))
                        .opacity(state.isSnappedToBottom ? 1 : 0)
                        .disabled(!state.isSnappedToBottom)
                        
                        // filters
                        VStack {
                            HomeMainFilters()
                            Spacer()
                        }
//                        .animation(state.state == .animating ? .none : .spring(response: 0.3333))
                        .offset(y: mapHeight + searchBarHeight / 2 - 4 + (
                            state.showFiltersAbove ? -100 : 0
                        ))
                        .opacity(isOnSearchResults ? 0 : 1)

                        // searchbar
                        VStack {
                            GeometryReader { searchBarGeometry -> HomeSearchBar in
                                HomeSearchBarState.frame = searchBarGeometry.frame(in: .global)
                                return HomeSearchBar()
                            }
                            .frame(height: searchBarHeight)
                            
                            Spacer()
                        }
//                        .animation(
//                            state.state == .animating ? .none :
//                                state.state == .idle ? .spring(response: 0.25) : .spring(response: 0.1)
//                        )
                        .padding(.horizontal, 10)
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
                            // why is this off 80???
                            if HomeSearchBarState.isWithin(value.startLocation.y - 40) || state.dragState == .searchbar {
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
