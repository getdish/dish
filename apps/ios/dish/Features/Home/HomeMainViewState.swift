import SwiftUI
import Combine

fileprivate let snapToBottomYMovePct: CGFloat = 0.6

fileprivate let distanceUntilSnapDown: CGFloat = 30
fileprivate let distanceUntilSnapUp: CGFloat = 35

fileprivate let nearTopAtVal: CGFloat = 120 + Screen.statusBarHeight
fileprivate let topNavHeight: CGFloat = 45

class HomeViewState: ObservableObject {
    enum HomeDragState {
        case idle, off, pager, searchbar
    }
    enum HomeAnimationState {
        case idle, controlled, animate
    }
    enum HomeScrollState {
        case none, some, more
    }
    
    // temp
    @Published var showFilters: Bool = false
    
    @Published private(set) var appHeight: CGFloat = Screen.height
    // initialize it at best estimate where the snapToBottom will be
    @Published private var y: CGFloat = Screen.fullHeight * 0.3 * snapToBottomYMovePct - 1
    @Published private(set) var searchBarYExtra: CGFloat = 0
    @Published private(set) var hasScrolled: HomeScrollState = .none
    @Published private(set) var hasMovedBar = false
    @Published private(set) var dragState: HomeDragState = .idle
    @Published private(set) var animationState: HomeAnimationState = .idle
    @Published private(set) var showCamera = false
    @Published private(set) var keyboardHeight: CGFloat = 0
    
    private var scrollState = HomeMainScrollState()
    private var activeScrollView: UIScrollView? = nil
    private var cancelAnimation: AnyCancellable? = nil
    private var cancels: Set<AnyCancellable> = []
    private var keyboard = Keyboard()
    private var lastKeyboardAdjustY: CGFloat = 0
    
    init() {
        // start map height at just above snapToBottomAt
        self.$appHeight
            .debounce(for: .milliseconds(200), scheduler: App.queueMain)
            .sink { val in
                if !self.isSnappedToTop && !self.isSnappedToBottom {
                    async {
                        let y = self.snapToBottomAt - 1
                        print(" ⏩ appHeight.setY \(y)")
                        self.y = y
                    }
                }
        }
        .store(in: &cancels)
        
        // TODO move this into the setY directly
        // haptic feedback
        let lightFeedback = UIImpactFeedbackGenerator(style: .light)
        let strongFeedback = UIImpactFeedbackGenerator(style: .heavy)
        enum HapticFeedbackState { case idle, light, strong }
        var hasHapticIndicatedThisDrag: HapticFeedbackState = .idle
        var lastSnapToBottom = false
        // reset on finish drag
        self.$dragState.sink { dragState in
            if dragState == .idle {
                hasHapticIndicatedThisDrag  = .idle
            }
            }.store(in: &cancels)
        // listen for haptic events
        self.$y
            .sink { y in
                if y >= self.startSnapToBottomAt + 10 && hasHapticIndicatedThisDrag == .idle {
                    hasHapticIndicatedThisDrag = .light
                    lightFeedback.impactOccurred()
                }
                if lastSnapToBottom != self.isSnappedToBottom && hasHapticIndicatedThisDrag != .strong {
                    hasHapticIndicatedThisDrag = .strong
                    lastSnapToBottom = self.isSnappedToBottom
                    strongFeedback.impactOccurred()
                }
            }
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
            .assign(to: \.keyboardHeight, on: self)
            .store(in: &cancels)
        
        self.keyboard.$state
            .map { $0.height }
            .removeDuplicates()
            .sink { height in
//                let isOpen = height > 0
                
                // disable top nav when keyboard open
//                App.store.send(.setDisableTopNav(isOpen))
                
                // map up/down on keyboard open/close
//                if !self.isSnappedToBottom {
//                    self.animate {
//                        print(" ⏩ homeViewKeyboardState.setY \(isOpen)")
//                        if isOpen {
//                            let str = max(0, 1 - (self.snapToBottomAt - self.y) / self.snapToBottomAt)
//                            let amt = 170 * str
//                            self.y -= amt
//                            self.lastKeyboardAdjustY = amt
//                        } else {
//                            self.y += self.lastKeyboardAdjustY
//                        }
//                    }
//                }
                
        }
        .store(in: &cancels)
        
        let started = Date()
        self.scrollState.$scrollY
            .throttle(for: 0.125, scheduler: App.queueMain, latest: true)
            .removeDuplicates()
            .sink { y in
                if Date().timeIntervalSince(started) < 3 {
                    return
                }
                let next: HomeViewState.HomeScrollState =
                    homeViewState.isSnappedToBottom ? .none : (
                        y > 60 ? .more : y > 30 ? .some : .none
                    )
                if next == self.hasScrolled {
                    return
                }
                print(" ⏩ hasScrolled = \(next) (y = \(y))")
                self.animate(state: .animate) {
                    self.hasScrolled = next
                }
        }.store(in: &cancels)
    }
    
    var showFiltersAbove: Bool {
        if y > snapToBottomAt - 1 { return false }
        if mapHeight < 190 { return false }
        return hasScrolled != .none
    }
    
    let mapMinHeight: CGFloat = max(
        nearTopAtVal - 1,
        Screen.statusBarHeight + searchBarHeight / 2 + topNavHeight + 50
    )
    
    var mapMaxHeight: CGFloat { appHeight - keyboardHeight - searchBarHeight }
    
    var mapHeight: CGFloat {
        min(mapMaxHeight, max(self.y - scrollRevealY, mapMinHeight))
    }
    
    var scrollRevealY: CGFloat {
        if hasScrolled == .more {
            // TODO if you want to have it "reveal" more on scroll
            return 0 //40
        }
        return 0
    }
    
    var snapToBottomAt: CGFloat {
        appHeight * snapToBottomYMovePct
    }
    
    var startSnapToBottomAt: CGFloat {
        snapToBottomAt - distanceUntilSnapDown
    }
    
    var snappedToBottomMapHeight: CGFloat { appHeight - 120 }
    var wasSnappedToBottom = false
    
    var isSnappedToBottom: Bool {
        y > snapToBottomAt
    }
    
    let nearTopAt: CGFloat = nearTopAtVal
    var isNearTop: Bool {
        self.mapHeight < self.nearTopAt
    }
    
    var isAboutToSnap: Bool {
        if y >= startSnapToBottomAt { return true }
        return false
    }
    
    func toggleMap() {
        log.info()
        self.snapToBottom(!isSnappedToBottom)
    }
    
    private var startDragAt: CGFloat = 0
    private var lastDragY: CGFloat = 0
    
    func setDragState(_ next: HomeDragState) {
        log.info()
        self.dragState = next
    }
    
    func setAnimationState(_ next: HomeAnimationState, _ duration: Int = 0) {
        async {
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
                DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(duration)) {
                    if active {
                        self.setAnimationState(.idle)
                        self.cancelAnimation = nil
                    }
                }
            }
        }
    }
    
    func animate(_ animation: Animation? = Animation.spring().speed(ANIMATION_SPEED), state: HomeAnimationState = .controlled, duration: Int = 400, _ body: @escaping () -> Void) {
        log.info("\(state) duration: \(duration)")
        self.setAnimationState(state, duration)
        async(1) {
            withAnimation(animation) {
                body()
            }
        }
    }

    func setY(_ dragY: CGFloat) {
        if dragState == .pager { return }
        if lastDragY == dragY { return }
        lastDragY = dragY
        
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
        let aboutToSnapToBottom = y >= startSnapToBottomAt && !isSnappedToBottom
        if aboutToSnapToBottom {
            let diff = self.startDragAt + dragY - startSnapToBottomAt
            y = startSnapToBottomAt + diff * 0.2
        }
        
        // store wasSnappedToBottom before changing y
        let wasSnappedToBottom = isSnappedToBottom
        
        if y == self.y {
            return
        }
        
        self.y = y
        
        // while snapped, have searchbar move differently
        // searchbar moves faster during resistance before snap
        if aboutToSnapToBottom {
            self.searchBarYExtra = y - startSnapToBottomAt
        } else if isSnappedToBottom {
            self.searchBarYExtra = dragY * 0.25
        }
        
        // snap to bottom/back logic
        let willSnapDown = !wasSnappedToBottom && isSnappedToBottom
        if willSnapDown {
            self.snapToBottom(true)
        } else if wasSnappedToBottom {
            let willSnapUp = -dragY > distanceUntilSnapUp
            if willSnapUp {
                self.snapToBottom(false)
            }
        }
    }
    
    func finishDrag(_ value: DragGesture.Value) {
        if dragState == .pager { return }
        log.info()
        
        // use velocity to determine snap
        
        print("🍗🍗 what trans \(value.predictedEndTranslation.height) loc \(value.predictedEndLocation.y)")
        
        let predictedY = value.predictedEndLocation.y
        let diff = self.y > predictedY ? -(self.y - predictedY) : predictedY - self.y
        
        // default scrolling is very "loose", but this should feel a bit more tight
        let finalY = self.y + diff / 2
        
        let shouldSnapDown = finalY > snapToBottomAt
        
        let animation: Animation = shouldSnapDown
            ? Animation.spring().speed(ANIMATION_SPEED)
            : Animation.easeOut.speed(ANIMATION_SPEED)
        
        self.animate(animation) {
            if shouldSnapDown || self.isSnappedToBottom {
                self.snapToBottom()
                self.y = self.startSnapToBottomAt
            } else {
                print("🍩 predictedY \(predictedY) finalY \(finalY)")
                self.y = finalY
            }
            
            if self.searchBarYExtra != 0 {
                self.searchBarYExtra = 0
            }
        }
    }
    
    func snapToBottom(_ toBottom: Bool = true) {
        log.info()
        // prevent dragging after snap
        self.setDragState(.off)
        self.animate(Animation.spring().speed(ANIMATION_SPEED)) {
            self.scrollState.setScrollY(0)
            self.searchBarYExtra = 0
            if toBottom {
                self.y = self.snappedToBottomMapHeight
            } else {
                self.y = self.startSnapToBottomAt
            }
        }
    }
    
    var mapSnappedToTopHeight: CGFloat {
        self.mapMinHeight
    }
    
    var isSnappedToTop: Bool {
        self.y == mapSnappedToTopHeight
    }
    
    func snapToTop() {
        log.info()
        if !isSnappedToTop {
            //            self.hasMovedBar = false
            self.animate {
                self.y = self.mapMinHeight
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
    
    func setScrollY(_ frame: CGRect) {
        if dragState != .idle { return }
        if animationState != .idle { return }
        let scrollY = mapHeight - frame.minY - Screen.statusBarHeight - scrollRevealY
        let y = max(-50, min(100, scrollY))
        if y != scrollState.scrollY {
            print("disabled scroll stuff for now")
//            self.scrollState.setScrollY(y)
        }
    }
    
    func moveToSearchResults() {
        if isSnappedToBottom { return }
        if dragState == .idle && y >= 0 {
            log.info()
            self.animateTo(y - 80)
        }
    }
    
    var hasSetInitialY = false
    func setAppHeight(_ val: CGFloat) {
        log.info()
        self.appHeight = val
        // do once on startup
        if !hasSetInitialY {
            hasSetInitialY = true
            self.y = val * 0.3
        }
    }
    
    func setShowCamera(_ val: Bool) {
        self.animate(state: .animate) {
            self.showCamera = val
        }
    }
    
    // this updates often and doesnt need to update parent views
    // its essentially "private" impl detail
    class HomeMainScrollState: ObservableObject {
        @Published private(set) var scrollY: CGFloat = 0
        
        func setScrollY(_ next: CGFloat) {
            self.scrollY = next
        }
    }
}

// active scroll view logic
extension HomeViewState {
    var isActiveScrollViewAtTop: Bool {
        self.activeScrollView?.contentOffset.y == 0
    }
    
    func setActiveScrollView(_ val: UIScrollView?) {
        self.activeScrollView = val
    }
}
