import SwiftUI

struct BottomDrawer<Content: View>: View {
    @Environment(\.colorScheme) var colorScheme
    @EnvironmentObject var screen: ScreenModel
    
    @GestureState private var dragState = DragState.inactive
    @Binding var position: BottomDrawerPosition
    @State var mass: Double = 1.5
    
    var snapPoints: [CGFloat] = [100, 400, 600]
    var background: AnyView? = nil
    var cornerRadius: CGFloat = 12.0
    var handle: AnyView? = AnyView(RoundedRectangle(cornerRadius: 5 / 2.0)
        .frame(width: 40, height: 5)
        .foregroundColor(Color.secondary)
        .padding(5))
    
    func getSnapPoint(_ position: BottomDrawerPosition) -> CGFloat {
        self.snapPoints[position == .top ? 0 : position == .middle ? 1 : 2]
    }
    
    var positionY: CGFloat {
        getSnapPoint(self.position)
    }
    
    var draggedPositionY: CGFloat {
        let dragHeight = self.dragState.translation.height
        let at = self.positionY + dragHeight
        
        if at < snapPoints[0] {
            return snapPoints[0] - (snapPoints[0] - at) * 0.2
        }
        
        return at
    }
    
    typealias OnChangePositionCB = (BottomDrawerPosition, CGFloat) -> Void
    var onChangePosition: OnChangePositionCB? = nil
    var onDragState: ((DragState) -> Void)? = nil
    
    enum Lock { case drawer, content, filters }
    @State var lock: Lock = .drawer
    
    var content: () -> Content

    var body: some View {
        let screenHeight = screen.height
        let belowHeight = self.dragState.isDragging
            ? 0
            : max(0, screenHeight - (screenHeight - getSnapPoint(self.position)))
        return ZStack {
            RunOnce(name: "BottomDrawer.start") {
                async(10) {
                    self.callbackChangePosition()
                }
            }
            
            VStack(spacing: 0) {
                if handle != nil {
                    self.handle
                    Spacer().frame(height: 12)
                }
                
                self.content()
                
                // pad bottom so it wont go below
                Spacer().frame(height: belowHeight)
            }
        }
            .frame(height: screenHeight, alignment: .top)
            .background(
                Color(.systemBackground)
//                BlurView(style: colorScheme == .dark ? .systemMaterialDark : .systemMaterialLight)
            )
            .cornerRadius(self.cornerRadius)
            .shadow(color: Color(white: 0, opacity: 0.27), radius: 20.0)
            .offset(y: self.draggedPositionY)
            .onGeometryFrameChange { geometry in
                async {
                    self.callbackChangePosition()
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
        DragGesture(minimumDistance: 12)
            .updating($dragState) { drag, state, transaction in
                if self.lock != .drawer {
                    if App.store.state.home.drawerPosition != .bottom {
                        print("\(drag.translation.height)")
                        let distToScrollable: CGFloat = 120
                        if drag.startLocation.y > self.draggedPositionY + distToScrollable,
                            drag.translation.height < 25 {
                            async {
                                self.lock = .content
                            }
                            return
                        }
                        
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
                let validDrag = h > 12 || h < -12
                if validDrag {
                    if self.lock != .drawer {
                        async {
                            self.lock = .drawer
                        }
                    }
                    let wasDragging = self.dragState.isDragging
                    state = .dragging(translation: drag.translation)
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
        let throwDirection = drag.predictedEndLocation.y - drag.location.y
        // were adding more friction here
        let predictedEnd = drag.location.y + throwDirection * 0.66
//        print("predictedEnd \(predictedEnd) \(drag.predictedEndLocation.y)")
        
        let cardTopEdgeLocation = self.positionY + drag.translation.height
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
        let distanceToSnap: CGFloat = closestPosition == self.position ? 90 : 160
        
//        print("distanceToSnap \(distanceToSnap) throwDirection \(throwDirection) closestPoint \(closestPoint) closestPosition \(closestPosition)")
        
        if predictedEnd < getSnapPoint(.top) {
            self.position = .top
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
        self.mass = 2.65 - max(1, (max(1, min(100, Double(abs(throwDirection)))) / 50))
        self.lock = .drawer
        
        if let cb = self.onDragState { cb(self.dragState) }
        self.callbackChangePosition()
    }
    
    private func callbackChangePosition() {
        async {
            if let cb = self.onChangePosition {
                cb(self.position, self.draggedPositionY)
            }
        }
    }
}

// swiftui preview breaks if i put these inside the above struct :(

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
