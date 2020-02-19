import SwiftUI

struct BottomSlideDrawer<Content: View> : View {
    @EnvironmentObject var screen: ScreenModel
    
    enum CardPosition {
        case top, middle, bottom
    }
    
    @GestureState private var dragState = DragState.inactive
    @State var position = CardPosition.top
    var snapPoints: [CGFloat] = [100, 400, 600]
    
    func getSnapPoint(_ position: CardPosition) -> CGFloat {
        self.snapPoints[position == .top ? 0 : position == .middle ? 1 : 2]
    }
    
    var positionY: CGFloat {
        getSnapPoint(self.position)
    }
    
    var content: () -> Content
    var body: some View {
        let drag = DragGesture()
            .updating($dragState) { drag, state, transaction in
                state = .dragging(translation: drag.translation)
        }
        .onEnded(onDragEnded)
        
        return Group {
            Handle()
            self.content()
        }
        .frame(height: UIScreen.main.bounds.height)
        .background(Color.white)
        .cornerRadius(10.0)
        .shadow(color: Color(.sRGBLinear, white: 0, opacity: 0.13), radius: 10.0)
        .offset(y: self.positionY + self.dragState.translation.height)
        .animation(self.dragState.isDragging ? nil : .interpolatingSpring(stiffness: 300.0, damping: 30.0, initialVelocity: 10.0))
        .gesture(drag)
    }
    
    private func onDragEnded(drag: DragGesture.Value) {
        let verticalDirection = drag.predictedEndLocation.y - drag.location.y
        let cardTopEdgeLocation = self.positionY + drag.translation.height
        let positionAbove: CardPosition
        let positionBelow: CardPosition
        let closestPosition: CardPosition
        
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

    struct Handle: View {
        private let handleThickness = CGFloat(5.0)
        var body: some View {
            RoundedRectangle(cornerRadius: handleThickness / 2.0)
                .frame(width: 40, height: handleThickness)
                .foregroundColor(Color.secondary)
                .padding(5)
        }
    }
}
