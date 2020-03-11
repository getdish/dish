import Combine
import SwiftUI

// TODO dont set mass dynamically, set initialVelocity, make it spingy on throw!...

enum BottomDrawerPosition: Int {
  case top = 0
  case middle = 1
  case bottom = 2
}

enum DragState: Equatable {
  case inactive
  case dragging(translation: CGSize)

  var translation: CGSize {
    switch self {
    case .inactive:
      return .zero
    case .dragging(let translation):
      return translation
    }
  }

  var isDragging: Bool {
    switch self {
    case .inactive:
      return false
    case .dragging:
      return true
    }
  }
}

class BottomDrawerStore: ObservableObject {
  @Published var positionY: CGFloat = 0

  enum EndPan {
    case velocity(_ speed: CGPoint)
  }

  @Published var endPan: EndPan? = nil
}

let bottomDrawerStore = BottomDrawerStore()

struct BottomDrawer<Content: View>: View {
  typealias OnChangePositionCB = (BottomDrawerPosition, CGFloat) -> Void
  enum Lock { case idle, drawer, content, filters }

  @Environment(\.colorScheme) var colorScheme
  @EnvironmentObject var screen: ScreenModel
  @GestureState private var dragState = DragState.inactive
  @State var mass: Double = 1.5
  @State var cancellables: Set<AnyCancellable> = []
  @State var externalDragY: CGFloat = 0
  @State var lock: Lock = .idle
  @State var isMounting = true
  @State var ignoreInitialDrags = 0
  @State var shouldAnimate = false

  var preventDragAboveSnapPoint: BottomDrawerPosition?
  var background: Color?
  var content: Content
  var cornerRadius: CGFloat
  var handle: AnyView? = nil
  var onChangePosition: OnChangePositionCB?
  var onDragState: ((DragState) -> Void)?
  @Binding var position: BottomDrawerPosition
  var snapPoints: [CGFloat]

  init(
    background: Color? = nil,
    cornerRadius: CGFloat = 12.0,
    handle: AnyView? = nil,
    onChangePosition: OnChangePositionCB? = nil,
    onDragState: ((DragState) -> Void)? = nil,
    position: Binding<BottomDrawerPosition>,
    preventDragAboveSnapPoint: BottomDrawerPosition? = nil,
    snapPoints: [CGFloat] = [100, 400, 600],
    content: () -> Content
  ) {
    self.background = background
    self.snapPoints = snapPoints
    self.cornerRadius = cornerRadius
    self.handle = handle
    self.onChangePosition = onChangePosition
    self.onDragState = onDragState
    self._position = position
    self.content = content()
    self.preventDragAboveSnapPoint = preventDragAboveSnapPoint
  }

  func getSnapPoint(_ position: BottomDrawerPosition) -> CGFloat {
    self.snapPoints[position == .top ? 0 : position == .middle ? 1 : 2]
  }

  var positionY: CGFloat {
    getSnapPoint(self.position)
  }
  
  let overflowDamping: CGFloat = 0.25

  var draggedPositionY: CGFloat {
    let dragHeight = self.dragState.translation.height
    let at = self.positionY + dragHeight + self.externalDragY
    
    // mid (user conf) overflow damp (before top)
    if dragState.isDragging,
      let snapPoint = preventDragAboveSnapPoint {
      let i = snapPoint.rawValue
      if at < snapPoints[i] {
        return snapPoints[i] - (snapPoints[i] - at) * overflowDamping
      }
    }

    // top overflow damp
    if at < snapPoints[0] {
      return snapPoints[0] - (snapPoints[0] - at) * overflowDamping
    }

    // bottom overflow damp
    if at > snapPoints[2] {
      return snapPoints[2] + (at - snapPoints[2]) * overflowDamping
    }

    return at
  }

  func start() {
    async(10) {
      self.afterChangePosition()
    }
    async(200) {
      self.isMounting = false
    }

    bottomDrawerStore.$positionY
      .dropFirst()
      .sink { y in
        self.externalDragY = y
      }
      .store(in: &self.cancellables)

    bottomDrawerStore.$endPan
      .dropFirst()
      .debounce(for: .milliseconds(16), scheduler: App.queueMain)
      .compactMap { $0 }
      .sink { val in
        self.ignoreInitialDrags = 0
        self.lock = .idle

        switch val {
        case .velocity(let speed):
          self.finishDrag(speed.y, currentY: self.draggedPositionY)
        }
      }
      .store(in: &self.cancellables)
  }

  var body: some View {
    let screenHeight = screen.height
    return ZStack {
      Color.clear.onAppear(perform: self.start)
      
//      if self.colorScheme == .dark {
//        LinearGradient(
//          gradient: .init(colors: [.clear, .black]),
//          startPoint: .top,
//          endPoint: .bottom
//        )
//      }
      
      BlurView(style: self.colorScheme == .dark ? .dark : .light)
      
//      if self.colorScheme == .dark {
//        App.store.state.home.lenses[App.store.state.home.lenseActive].color
//          .opacity(0.1)
//      }

      // handle
      VStack {
        RoundedRectangle(cornerRadius: 5)
          .frame(width: 40, height: 5)
          .opacity(0.35)
          .padding(.vertical, 5)
        Spacer()
      }
        .opacity(self.dragState.isDragging || self.isMounting ? 1 : 0)
        .animation(
          Animation.spring()
            .delay(self.isMounting ? 1 : self.dragState.isDragging ? 0 : 0.5))

      self.content
    }
    .frame(width: App.screen.width, height: screenHeight, alignment: .top)
      .background(
        self.background
      )
      .cornerRadius(self.cornerRadius)
      .shadow(
        color: self.colorScheme == .dark
          ? Color(white: 0, opacity: 0.7)
          : Color(white: 0, opacity: 0.27),
        radius: 8
      )
      .offset(y: self.draggedPositionY)
      .onGeometryFrameChange(self.onGeometryFrameChange)
      .animation(
        self.dragState.isDragging && !self.shouldAnimate ? nil
          : .interpolatingSpring(mass: self.mass, stiffness: 120.0, damping: 20.0, initialVelocity: 0)
      )
      .gesture(
        DragGesture(minimumDistance: self.position == .top ? 15 : self.position == .middle ? 15 : 8)
          .updating($dragState) { drag, state, transaction in
            self.onUpdateDrag(drag, state: &state, transaction: &transaction)
          }
          .onEnded(onDragEnded)

      )
  }
  
  @State var dragOngoing = false

  func onUpdateDrag(
    _ drag: DragGesture.Value, state: inout DragState, transaction: inout Transaction
  ) {
    //                print("BottomDrawer.drag self.lock \(self.lock) targetLock \(mainContentScrollState.scrollTargetLock)")

    // avoid conflicting drags
    if mainContentScrollState.scrollTargetLock == .drawer && self.lock != .drawer
      || mainContentScrollState.scrollTargetLock == .content
    {
      return
    }
    
    if dragOngoing == false {
      async {
        self.dragOngoing = true
        // one time actions
        self.shouldAnimate = true
        async(50) {
          self.shouldAnimate = false
        }
      }
    }
    

    if self.lock != .drawer {
      if App.store.state.home.drawerPosition != .bottom {
        let distToFilterBar: CGFloat = 60
        if drag.startLocation.y > self.draggedPositionY + distToFilterBar,
          drag.translation.height < 12
        {
          async {
            self.lock = .filters
          }
          return
        }

      }
    }
    let h = drag.translation.height
    let validDrag = h > 8 || h < -8
    if validDrag {
      if self.lock != .drawer {
        // fix bug where it was catching both scrollview + bottomdrawer on fast drags
        if self.ignoreInitialDrags < 2 {
          async {
            self.ignoreInitialDrags += 1
            let cur = self.ignoreInitialDrags
            async(50) {
              if self.ignoreInitialDrags == cur {
                // hasnt dragged, lets reset its likely happening in scrollview
                self.ignoreInitialDrags = 0
              }
            }
          }
          return
        }

        async {
          self.lock = .drawer
          // todo bad state sync
          mainContentScrollState.scrollTargetLock = .drawer
        }
      }
      let wasDragging = self.dragState.isDragging
      state = .dragging(translation: drag.translation)
      if !wasDragging {
        if let cb = self.onDragState { cb(state) }
      }
    }
  }

  func onGeometryFrameChange(_ geometry: CGRect) {
    async {
      self.afterChangePosition()
    }
  }

  private func getDistance(_ position: BottomDrawerPosition, from: CGFloat) -> CGFloat {
    let y = getSnapPoint(position)
    return y > from ? y - from : from - y
  }

  private func onDragEnded(drag: DragGesture.Value) {
    self.ignoreInitialDrags = 0
    // todo bad state sync
    if self.lock == .drawer {
      mainContentScrollState.scrollTargetLock = .idle
    }
    self.finishDrag(
      drag.predictedEndLocation.y - drag.location.y,
      currentY: self.positionY + drag.translation.height
    )
  }

  func finishDrag(_ throwAmount: CGFloat, currentY: CGFloat) {
    self.externalDragY = 0
    let next = self.getNextPosition(throwAmount, currentY: currentY)
    if let min = preventDragAboveSnapPoint {
      if next.rawValue >= min.rawValue {
        self.position = next
      }
      else if min == .middle && next == .top {
        self.position = .middle
      }
    }
    // roughly makes animation speed match throw velocity
    self.mass = 2.65 - max(1, (max(1, min(100, Double(abs(throwAmount)))) / 50))
    print("🐱 finishing with mass \(self.mass)")
    self.dragOngoing = false
    self.lock = .idle
    // callbacks
    if let cb = self.onDragState { cb(self.dragState) }
    self.afterChangePosition()
  }
  
  private func getNextPosition(_ throwAmount: CGFloat, currentY: CGFloat) -> BottomDrawerPosition {
    let predictedEnd = currentY + throwAmount * 0.45
    let cardTopEdgeLocation = currentY
    let positionAbove: BottomDrawerPosition
    let positionBelow: BottomDrawerPosition
    
    let distanceToTop = getDistance(.top, from: predictedEnd)
    let distanceToMid = getDistance(.middle, from: predictedEnd)
    let distanceToBottom = getDistance(.bottom, from: predictedEnd)
    let closestPoint = min(distanceToTop, distanceToMid, distanceToBottom)
    
    let closestPosition: BottomDrawerPosition = closestPoint == distanceToTop
      ? .top : closestPoint == distanceToMid ? .middle : .bottom
    
    if cardTopEdgeLocation <= getSnapPoint(.middle) {
      positionAbove = .top
      positionBelow = .middle
    } else {
      positionAbove = .middle
      positionBelow = .bottom
    }
    
    // NOTE: this is a nice little interaction tweak
    // we basically are "more likely to snap away" if you release near your current snapPoint
    // this is maybe unintuitive, but think of it like this: you want to do a small flick
    // to move it away. But if you are dragging from the top, and hold it "over" the middle,
    // then release it, you then want to be more lenient and have it snap to middle more often
    let distanceToSnap: CGFloat = closestPosition == self.position ? 80 : 160
    
    //    print(
    //      "predictedEnd \(predictedEnd) distanceToSnap \(distanceToSnap) throwAmount \(throwAmount) closestPoint \(closestPoint) closestPosition \(closestPosition)"
    //    )
    
    if predictedEnd < getSnapPoint(.top) {
      return .top
    } else if predictedEnd > getSnapPoint(.bottom) {
      return .bottom
    } else if closestPoint < distanceToSnap {
      return closestPosition
    } else {
      // not within the safe zone that snaps back to closest position
      // instead just snap to the one were headed towards
      if cardTopEdgeLocation > getSnapPoint(self.position) {
        return positionBelow
      }
    }
    return positionAbove
  }

  private func afterChangePosition() {
    async {
      if let cb = self.onChangePosition {
        cb(self.position, self.draggedPositionY)
      }
    }
  }
}

// swiftui preview breaks if i put these inside the above struct :(

#if DEBUG
  struct BottomDrawer_Previews: PreviewProvider {
    static var previews: some View {
      BottomDrawer(
        position: .constant(.top),
        snapPoints: [100, 400, 700]
      ) {
        VStack {
          Color.red
          Spacer()
        }
      }
        .embedInAppEnvironment()
    }
  }
#endif
