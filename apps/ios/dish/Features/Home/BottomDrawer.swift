import SwiftUI
import Combine

enum BottomDrawerPosition {
    case top, middle, bottom
}

enum DragState {
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
    @Environment(\.colorScheme) var colorScheme
    @EnvironmentObject var screen: ScreenModel
    
    @GestureState private var dragState = DragState.inactive
    @Binding var position: BottomDrawerPosition
    @State var mass: Double = 1.5
    @State var cancellables: Set<AnyCancellable> = []
    
    var background: Color? = nil
    var snapPoints: [CGFloat] = [100, 400, 600]
    var cornerRadius: CGFloat = 12.0
    var handle: AnyView? = nil
    
    func getSnapPoint(_ position: BottomDrawerPosition) -> CGFloat {
        self.snapPoints[position == .top ? 0 : position == .middle ? 1 : 2]
    }
    
    var positionY: CGFloat {
        getSnapPoint(self.position)
    }
    
    @State var externalDragY: CGFloat = 0
    
    var draggedPositionY: CGFloat {
        let dragHeight = self.dragState.translation.height
        let at = self.positionY + dragHeight + self.externalDragY
        
        // top overflow damp
        if at < snapPoints[0] {
            return snapPoints[0] - (snapPoints[0] - at) * 0.15
        }
        
        // bottom overflow damp
        if at > snapPoints[2] {
            return snapPoints[2] + (at - snapPoints[2]) * 0.15
        }
        
        
        return at
    }
    
    typealias OnChangePositionCB = (BottomDrawerPosition, CGFloat) -> Void
    var onChangePosition: OnChangePositionCB? = nil
    var onDragState: ((DragState) -> Void)? = nil
    
    enum Lock { case drawer, content, filters }
    @State var lock: Lock = .drawer
    @State var isMounting = true
    
    var content: () -> Content
    
    func start() {
        async(10) {
            self.afterChangePosition()
        }
        async(2000) {
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
                switch val {
                    case .velocity(let speed):
                        self.finishDrag(speed.y, currentY: self.draggedPositionY)
                }
        }
        .store(in: &self.cancellables)
    }
    
    func updateStore() {
        //        let next = BottomDrawerStore.PositionState(controlledBy: .inside, y: self.draggedPositionY)
        //        if bottomDrawerStore.positionY != next {
        //            bottomDrawerStore.positionY = next
        //        }
    }
    
    var body: some View {
        let screenHeight = screen.height
        let belowHeight = self.dragState.isDragging
            ? 0
            : max(0, screenHeight - (screenHeight - getSnapPoint(self.position)))
        
        return ZStack {
            Color.clear.onAppear {
                self.start()
            }
            
            VStack {
                RoundedRectangle(cornerRadius: 5)
                    .frame(width: 40, height: 5)
                    .opacity(0.35)
                    .padding(.vertical, 5)
                Spacer()
            }
            .opacity(self.dragState.isDragging || self.isMounting ? 1 : 0)
            .animation(Animation.spring().delay(self.isMounting ? 1 : self.dragState.isDragging ? 0 : 0.5))
            
            VStack(spacing: 0) {
                self.content()
                //                    .disabled(self.position != .top)
                //                    .allowsHitTesting(self.position == .top)
                
                // pad bottom so it wont go below
                Spacer().frame(height: belowHeight)
            }
        }
        .frame(height: screenHeight, alignment: .top)
        .background(
            self.background
        )
            .cornerRadius(self.cornerRadius)
            .shadow(
                color: self.colorScheme == .dark
                    ? Color(white: 0, opacity: 0.7)
                    : Color(white: 0, opacity: 0.27),
                radius: 20.0
        )
            .offset(y: self.draggedPositionY)
            .onGeometryFrameChange { geometry in
                async {
                    self.afterChangePosition()
                }
        }
        .animation(self.dragState.isDragging
            ? nil
            : .interpolatingSpring(mass: self.mass, stiffness: 90.0, damping: 25.0, initialVelocity: 0)
        )
            .gesture(
                self.gesture
        )
    }
    
    var gesture: _EndedGesture<GestureStateGesture<DragGesture, DragState>> {
        DragGesture(minimumDistance: self.position == .top ? 15 : self.position == .middle ? 15 : 8)
            .updating($dragState) { drag, state, transaction in
//                print("BottomDrawer.drag self.lock \(self.lock) targetLock \(mainContentScrollState.scrollTargetLock)")
                
                // avoid conflicting drags
                if mainContentScrollState.scrollTargetLock == .drawer && self.lock != .drawer ||
                    mainContentScrollState.scrollTargetLock == .content {
                    return
                }
                
                if self.lock != .drawer {
                    if App.store.state.home.drawerPosition != .bottom {
                        print("\(drag.translation.height)")
                        let distToFilterBar: CGFloat = 60
                        if drag.startLocation.y > self.draggedPositionY + distToFilterBar,
                            drag.translation.height < 12 {
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
                        async {
                            self.lock = .drawer
                            // todo bad state sync
                            mainContentScrollState.scrollTargetLock = .drawer
                        }
                    }
                    let wasDragging = self.dragState.isDragging
                    state = .dragging(translation: drag.translation)
                    self.updateStore()
                    if !wasDragging {
                        if let cb = self.onDragState { cb(state) }
                    }
                }
        }
        .onEnded(onDragEnded)
    }
    
    private func getDistance(_ position: BottomDrawerPosition, from: CGFloat) -> CGFloat {
        let y = getSnapPoint(position)
        return y > from ? y - from : from - y
    }
    
    private func onDragEnded(drag: DragGesture.Value) {
        // todo bad state sync
        if self.lock == .drawer {
            mainContentScrollState.scrollTargetLock = .idle
        }
        self.finishDrag(drag.predictedEndLocation.y - drag.location.y, currentY: self.positionY + drag.translation.height)
    }
    
    func finishDrag(_ throwAmount: CGFloat, currentY: CGFloat) {
        self.externalDragY = 0
        
        let predictedEnd = currentY + throwAmount * 0.66
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
        
        print("predictedEnd \(predictedEnd) distanceToSnap \(distanceToSnap) throwAmount \(throwAmount) closestPoint \(closestPoint) closestPosition \(closestPosition)")
        
        if predictedEnd < getSnapPoint(.top) {
            self.position = .top
        } else if predictedEnd > getSnapPoint(.bottom) {
            self.position = .bottom
        } else if closestPoint < distanceToSnap {
            self.position = closestPosition
        } else {
            // not within the safe zone that snaps back to closest position
            // instead just snap to the one were headed towards
            if cardTopEdgeLocation > getSnapPoint(self.position) {
                self.position = positionBelow
            } else {
                self.position = positionAbove
            }
        }
        
        // makes the animation speed match the throw velocity
        self.mass = 2.65 - max(1, (max(1, min(100, Double(abs(throwAmount)))) / 50))
        self.lock = .drawer
        if let cb = self.onDragState { cb(self.dragState) }
        self.afterChangePosition()
    }
    
    private func afterChangePosition() {
        self.updateStore()
        
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
                Color.blue
                Spacer()
            }
        }
        .embedInAppEnvironment()
    }
}
#endif
