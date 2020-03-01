import Combine
import SwiftUI

class HomeViewState: ObservableObject {
  enum HomeDragState {
    case idle, off, pager, searchbar, contentHorizontal
  }

  enum HomeAnimationState {
    case idle, controlled, animate
  }

  enum HomeScrollState {
    case none, some, more
  }

  @Published private(set) var appHeight: CGFloat = App.screen.height

  // initialize it at best estimate where the snapToBottom will be
  @Published private(set) var y: CGFloat = App.drawerSnapPoints[1]

  @Published private(set) var hasScrolled: HomeScrollState = .none
  @Published private(set) var dragState: HomeDragState = .idle
  @Published private(set) var animationState: HomeAnimationState = .idle
  @Published private(set) var keyboardHeight: CGFloat = 0

  private var scrollState = HomeMainScrollState()
  private var activeScrollView: UIScrollView? = nil
  private var cancelAnimation: AnyCancellable? = nil
  private var cancels: Set<AnyCancellable> = []
  private var keyboard = Keyboard()

  //    private var lastKeyboardAdjustY: CGFloat = 0

  init() {
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

    let started = Date()
    self.scrollState.$scrollY
      .throttle(for: 0.125, scheduler: App.queueMain, latest: true)
      .removeDuplicates()
      .sink { y in
        if Date().timeIntervalSince(started) < 3 {
          return
        }
        let next: HomeViewState.HomeScrollState =
          y > 60 ? .more : y > 30 ? .some : .none
        if next == self.hasScrolled {
          return
        }
        print(" ⏩ hasScrolled = \(next) (y = \(y))")
        self.animate(state: .animate) {
          self.hasScrolled = next
        }
      }.store(in: &cancels)
  }

  var scrollRevealY: CGFloat {
    if hasScrolled == .more {
      // TODO if you want to have it "reveal" more on scroll
      return 0  //40
    }
    return 0
  }

  func setDragState(_ next: HomeDragState) {
    logger.info()
    self.dragState = next
  }

  func setAnimationState(_ next: HomeAnimationState, _ duration: Double = 0) {
    // cancel last controlled animation
    if next != .idle,
      let handle = self.cancelAnimation
    {
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
    logger.info("\(state) duration: \(duration)")
    self.setAnimationState(state, duration)

    async(3) {  // delay so it updates animationState first in body
      withAnimation(animation) {
        body()
      }
    }
  }

  func setY(_ dragY: CGFloat) {
    if dragY != y {
      self.y = dragY
    }
  }

  func setScrollY(_ frame: CGRect) {
    if dragState != .idle { return }
    if animationState != .idle { return }
    let scrollY = y - frame.minY - App.screen.edgeInsets.top - scrollRevealY
    let y = max(-50, min(100, scrollY))
    if y != scrollState.scrollY {
      self.scrollState.setScrollY(y)
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

//        // TODO move this into the setY directly
//        // haptic feedback
//        let lightFeedback = UIImpactFeedbackGenerator(style: .light)
//        let strongFeedback = UIImpactFeedbackGenerator(style: .heavy)
//        enum HapticFeedbackState { case idle, light, strong }
//        var hasHapticIndicatedThisDrag: HapticFeedbackState = .idle
//        var lastSnapToBottom = false
//
//        // reset on finish drag
//        self.$dragState.sink { dragState in
//            if dragState == .idle {
//                hasHapticIndicatedThisDrag  = .idle
//            }
//            }.store(in: &cancels)
//
//        // listen for haptic events
//        self.$y
//            .sink { y in
//                if y >= self.startSnapToBottomAt + 10 && hasHapticIndicatedThisDrag == .idle {
//                    hasHapticIndicatedThisDrag = .light
//                    lightFeedback.impactOccurred()
//                }
//                if lastSnapToBottom != self.isSnappedToBottom && hasHapticIndicatedThisDrag != .strong {
//                    hasHapticIndicatedThisDrag = .strong
//                    lastSnapToBottom = self.isSnappedToBottom
//                    strongFeedback.impactOccurred()
//                }
//            }
//            .store(in: &cancels)

//self.keyboard.$state
//    .map { $0.height }
//    .removeDuplicates()
//    .sink { height in
//        // map up/down on keyboard open/close
//        //                if !self.isSnappedToBottom {
//        //                    self.animate {
//        //                        print(" ⏩ homeViewKeyboardState.setY \(isOpen)")
//        //                        if isOpen {
//        //                            let str = max(0, 1 - (self.snapToBottomAt - self.y) / self.snapToBottomAt)
//        //                            let amt = 170 * str
//        //                            self.y -= amt
//        //                            self.lastKeyboardAdjustY = amt
//        //                        } else {
//        //                            self.y += self.lastKeyboardAdjustY
//        //                        }
//        //                    }
//        //                }
//}
//    .store(in: &cancels)
