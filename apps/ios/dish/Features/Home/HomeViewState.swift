import SwiftUI
import Combine

fileprivate let snapToBottomYMovePct: CGFloat = 0.58
fileprivate let distanceUntilSnapDown: CGFloat = 42
fileprivate let distanceUntilSnapUp: CGFloat = 85

fileprivate func getInitialY(_ screenHeight: CGFloat) -> CGFloat {
    screenHeight * 0.7
}

class HomeViewState: ObservableObject {
    enum HomeDragState {
        case idle, off, pager, searchbar, contentHorizontal
    }
    enum HomeAnimationState {
        case idle, splash, controlled, animate
    }
    enum HomeScrollState {
        case none, some, more
    }
    
    // temp
    @Published var showFilters: Bool = false
    
    @Published private(set) var appHeight: CGFloat = App.screen.height
    // initialize it at best estimate where the snapToBottom will be
    @Published private(set) var y: CGFloat = getInitialY(App.screen.height)
    @Published private(set) var searchBarYExtra: CGFloat = 0
    @Published private(set) var hasScrolled: HomeScrollState = .none
    @Published private(set) var hasMovedBar = false
    @Published private(set) var dragState: HomeDragState = .idle
    @Published private(set) var animationState: HomeAnimationState = .splash
    @Published private(set) var showCamera = false
    @Published private(set) var keyboardHeight: CGFloat = 0
    @Published private(set) var locationLabelWidth: CGFloat = 0
    
    let snapToBottomAnimationDuration: Double = 550 * (1 / App.animationSpeed)
    
    private var scrollState = HomeMainScrollState()
    private var activeScrollView: UIScrollView? = nil
    private var cancelAnimation: AnyCancellable? = nil
    private var cancels: Set<AnyCancellable> = []
    private var keyboard = Keyboard()
    private var lastKeyboardAdjustY: CGFloat = 0
    
    init() {
        self.snapToBottom()
        
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
    
    var mapFullHeight: CGFloat {
        appHeight * 1.5
    }
    
    var showFiltersAbove: Bool {
        if y > snapToBottomAt - 1 {
            return true
        }
        if mapHeight < 190 {
            return false
        }
        return hasScrolled != .none
    }
    
    var mapMinHeight: CGFloat {
        App.screen.edgeInsets.top + App.searchBarHeight + 10
    }
    
    var mapMaxHeight: CGFloat {
        appHeight - App.searchBarHeight / 2 - App.screen.edgeInsets.bottom
    }
    
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
    
    var snappedToBottomMapHeight: CGFloat {
        appHeight - 37 - App.filterBarHeight - App.searchBarHeight / 2
    }
    
    var wasSnappedToBottom = false
    
    var isSnappedToBottom: Bool {
        y > snapToBottomAt
    }
    
    var isAboutToSnap: Bool {
        if y >= startSnapToBottomAt { return true }
        return false
    }
    
    func toggleSnappedToBottom() {
        log.info()
        self.snapToBottom(!isSnappedToBottom)
    }
    
    private var startDragAt: CGFloat = 0
    private var lastDragY: CGFloat = 0
    
    func setLocationLabelWidth(_ width: CGFloat) {
        self.locationLabelWidth = width
    }
    
    func setDragState(_ next: HomeDragState) {
        log.info()
        self.dragState = next
    }
    
    func setAnimationState(_ next: HomeAnimationState, _ duration: Double = 0) {
        // cancel last controlled animation
        if next != .idle,
            let handle = self.cancelAnimation {
            handle.cancel()
        }
        
        // set state
        self.animationState = next
        
        // end set state
        if duration > 0 {
            // allows cancel
            var cancel = false
            self.cancelAnimation = AnyCancellable { cancel = true }
            async(duration) {
                if cancel { return }
                self.setAnimationState(.idle)
                self.cancelAnimation = nil
            }
        }
    }
    
    func animate(
        _ animation: Animation? = Animation.spring().speed(App.animationSpeed),
        state: HomeAnimationState = .controlled,
        duration: Double = 400,
        _ body: @escaping () -> Void
    ) {
        log.info("\(state) duration: \(duration)")
        self.setAnimationState(state, duration)
        
        async(3) { // delay so it updates animationState first in body
            withAnimation(animation) {
                body()
            }
        }
    }
    
    var lastSnapAt = Date()
    
    func snapToBottom(_ toBottom: Bool = true) {
        log.info()
        self.lastSnapAt = Date()

        // prevent dragging after snap
        self.setDragState(.off)
        
        let duration = self.snapToBottomAnimationDuration
        
        self.animate(
            Animation.spring(response: 0.28, dampingFraction: 0.9).speed(App.animationSpeed),
            duration: duration
        ) {
            self.searchBarYExtra = 0
            self.scrollState.setScrollY(0)
            if toBottom {
                self.y = self.snappedToBottomMapHeight
            } else {
                self.y = self.startSnapToBottomAt - 150
            }
        }
        
        async(duration) {
            self.setDragState(.idle)
        }
    }

    func setY(_ dragY: CGFloat) {
        self.y = dragY
    }
    
    func finishDrag(_ value: DragGesture.Value) {
        if dragState == .pager { return }
        log.info()
        
        // continue movement with natural velocity
        let predictedY = value.predictedEndLocation.y
        let diff = self.y > predictedY ? -(self.y - predictedY) : predictedY - self.y
        
        // but default velocity is too "loose", tighten
        var finalY = self.y + diff / 2
        
        // dont snap to bottom too easily
        let startedJustAbove = self.y > startSnapToBottomAt - 20
        let startedFarAbove = self.y < startSnapToBottomAt - 50
        let finishesBelow = finalY > snapToBottomAt
        let finishesJustBelow = finalY < snapToBottomAt + 25
        if startedFarAbove && finishesBelow || startedJustAbove && finishesJustBelow  {
            finalY = startSnapToBottomAt
        }
        
        let shouldSnapDown = finalY > snapToBottomAt
        
        let animation: Animation = shouldSnapDown
            ? Animation.spring().speed(App.animationSpeed)
            : Animation.easeOut.speed(App.animationSpeed)
        
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
        if !self.hasMovedBar && self.y != 0 && App.store.state.home.viewStates.last!.search == "" {
            log.info()
            self.animateTo(0)
        }
    }
    
    func isWithinDraggableArea(_ val: CGFloat) -> Bool {
        let padding: CGFloat = 9
        return val >= self.y - App.searchBarHeight / 2 - padding
            && val <= self.y + App.searchBarHeight / 2 + padding
    }
    
    func setScrollY(_ frame: CGRect) {
        if dragState != .idle { return }
        if animationState != .idle { return }
        let scrollY = mapHeight - frame.minY - App.screen.edgeInsets.top - scrollRevealY
        let y = max(-50, min(100, scrollY))
        if y != scrollState.scrollY {
            self.scrollState.setScrollY(y)
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
        
        // only do once, move to start position
        if !hasSetInitialY {
            hasSetInitialY = true
            self.y = getInitialY(val)
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
