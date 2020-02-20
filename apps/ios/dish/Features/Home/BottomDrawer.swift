import SwiftUI

struct BottomDrawer<Content: View>: View {
    @EnvironmentObject var screen: ScreenModel
    
    @GestureState private var dragState = DragState.inactive
    @Binding var position: BottomDrawerPosition
    
    var snapPoints: [CGFloat] = [100, 400, 600]
    var background: AnyView = AnyView(Color.white)
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
        self.positionY + self.dragState.translation.height
    }
    
    typealias OnChangePositionCB = (BottomDrawerPosition, CGFloat) -> Void
    var onChangePosition: OnChangePositionCB? = nil
    
    var content: () -> Content

    var body: some View {
        let screenHeight = screen.height
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
                Spacer()
                    .frame(height: max(0, screenHeight - self.snapPoints.last! - screen.edgeInsets.bottom))
            }
        }
        .frame(height: screenHeight, alignment: .top)
        .background(self.background)
        .cornerRadius(self.cornerRadius)
        .shadow(color: Color(.sRGBLinear, white: 0, opacity: 0.13), radius: 10.0)
        .offset(y: self.draggedPositionY)
        .animation(self.dragState.isDragging
            ? nil
            : .interpolatingSpring(stiffness: 200.0, damping: 30.0, initialVelocity: 1.0)
        )
        .gesture(
            DragGesture()
                .updating($dragState) { drag, state, transaction in
                    state = .dragging(translation: drag.translation)
                    self.callbackChangePosition()
                }
                .onEnded(onDragEnded)
        )
    }
    
    private func onDragEnded(drag: DragGesture.Value) {
        let verticalDirection = drag.predictedEndLocation.y - drag.location.y
        let cardTopEdgeLocation = self.positionY + drag.translation.height
        let positionAbove: BottomDrawerPosition
        let positionBelow: BottomDrawerPosition
        let closestPosition: BottomDrawerPosition
        
        if cardTopEdgeLocation <= getSnapPoint(.middle) {
            positionAbove = .top
            positionBelow = .middle
        } else {
            positionAbove = .middle
            positionBelow = .bottom
        }
        
        if (cardTopEdgeLocation - getSnapPoint(positionAbove)) < (getSnapPoint(positionBelow) - cardTopEdgeLocation) {
            closestPosition = positionAbove
        } else {
            closestPosition = positionBelow
        }
        
        if verticalDirection > 0 {
            self.position = positionBelow
        } else if verticalDirection < 0 {
            self.position = positionAbove
        } else {
            self.position = closestPosition
        }
        
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
