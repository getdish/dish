import SwiftUI
import Combine

// need enum animateStatus = { .will, .is, .idle }
// then on idle we can apply .spring()

fileprivate let snapToBottomYMovePct: CGFloat = 0.23
fileprivate let resistanceYBeforeSnap: CGFloat = 48
fileprivate let nearTopAtVal: CGFloat = 120 + Screen.statusBarHeight
fileprivate let topNavHeight: CGFloat = 45

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
    // initialize it at where the snapToBottom will be about
    @Published private(set) var y: CGFloat = Screen.fullHeight * 0.3 * snapToBottomYMovePct - 1 {
        willSet(y) {
//            // util - break when the searchbar is at y
//            #if DEBUG
//            print("y \(y)")
//            if false, y > snapToBottomAt { // <- example
//                raise(SIGINT)
//            }
//            #endif
        }
    }
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
                        print(" ⏩ homeViewKeyboardState.setY \(isOpen)")
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
            .throttle(for: 0.125, scheduler: App.queueMain, latest: true)
            .removeDuplicates()
            .sink { y in
                if Date().timeIntervalSince(started) < 2 {
                    return
                }
                print("wut \(y)")
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
    
    var mapInitialHeight: CGFloat { appHeight * 0.3 }
    var mapMaxHeight: CGFloat { appHeight - keyboardHeight - searchBarHeight }
    
    var mapHeight: CGFloat {
        return min(
            mapMaxHeight, max(
                mapInitialHeight + y - scrollRevealY, mapMinHeight
            )
        )
    }
    
    var scrollRevealY: CGFloat {
        if hasScrolled == .more {
            return 40
        }
        return 0
    }
    
    var snapToBottomAt: CGFloat {
        appHeight * snapToBottomYMovePct
    }
    
    var startSnapToBottomAt: CGFloat {
        snapToBottomAt - resistanceYBeforeSnap
    }
    
    var snappedToBottomMapHeight: CGFloat { appHeight - 190 }
    var isSnappedToBottom: Bool { y > snapToBottomAt }
    var wasSnappedToBottom = false
    
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
        async (10) {
            withAnimation(animation) {
                body()
            }
        }
    }

    func drag(_ dragY: CGFloat) {
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
            } else if self.y > self.startSnapToBottomAt {
                self.y = self.startSnapToBottomAt
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
                self.y = self.startSnapToBottomAt
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
        let y = max(0, min(100, scrollY))
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
