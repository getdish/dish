import SwiftUI

struct BottomSlideDrawer<Content: View>: View {
    @EnvironmentObject var screen: ScreenModel
    
    @GestureState private var dragState = DragState.inactive
    @State var position = CardPosition.top
    var snapPoints: [CGFloat] = [100, 400, 600]
    var cornerRadius: CGFloat = 12.0
    var handle: AnyView? = AnyView(RoundedRectangle(cornerRadius: 5 / 2.0)
        .frame(width: 40, height: 5)
        .foregroundColor(Color.secondary)
        .padding(5))
    
    func getSnapPoint(_ position: CardPosition) -> CGFloat {
        self.snapPoints[position == .top ? 0 : position == .middle ? 1 : 2]
    }
    
    var positionY: CGFloat {
        getSnapPoint(self.position)
    }
    
    var content: () -> Content

    var body: some View {
        let screenHeight = screen.height
        let drag = DragGesture()
            .updating($dragState) { drag, state, transaction in
                state = .dragging(translation: drag.translation)
        }
        .onEnded(onDragEnded)
        
        return VStack(spacing: 0) {
            if handle != nil {
                self.handle
                Spacer().frame(height: 12)
            }
            self.content()
            // pad bottom so it wont go below
            Spacer()
                .frame(height: max(0, screenHeight - self.snapPoints.last! - screen.edgeInsets.bottom))
        }
        .frame(height: screenHeight, alignment: .top)
        .background(Color.white)
        .cornerRadius(self.cornerRadius)
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
}

// swiftui preview breaks if i put these inside the above struct :(

enum CardPosition {
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
struct BottomSlideDrawer_Previews: PreviewProvider {
    static var previews: some View {
        BottomSlideDrawer(
            position: .top,
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
