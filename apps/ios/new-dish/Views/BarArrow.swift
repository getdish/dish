import SwiftUI

enum BarArrowDirection {
    case up
    case down
    case left
    case right
}

struct BarArrow: View {
    var direction: BarArrowDirection = .up
    var color: Color = Color(.systemGray2) // TODO passing around color seems wrongish
    var thickness: CGFloat = 5.0
    // TODO make it sizable
    
    var body: some View {
        HStack {
            BarHorizontal(color: color, height: thickness)
                .rotationEffect(.degrees(-16 * (direction == .down ? 1 : -1)))
                .animation(.spring())
                .offset(x: 18)
            BarHorizontal(color: color, height: thickness)
                .rotationEffect(.degrees(16 * (direction == .down ? 1 : -1)))
                .animation(.spring())
                .offset(x: -18)
        }
        .rotationEffect(.degrees(direction == .left ? -90 : direction == .right ? 90 : 0))
    }
}

struct BarHorizontal: View {
    var color: Color = Color(.systemGray2)
    var height: CGFloat = 5.0
    
    var body: some View {
        RoundedRectangle(cornerRadius: 10.0)
            .fill(color)
            .frame(width: 17, height: height, alignment: .top)
    }
}
