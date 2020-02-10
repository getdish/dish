import SwiftUI

func topCornerMask(
    width: CGFloat = App.screen.width,
    height: CGFloat = App.screen.height,
    cornerRadius: CGFloat = 20
) -> Path {
    Path { path in
        path.move(to: CGPoint(x: 0, y: 0))
        path.addLine(to: CGPoint(x: 0, y: width))
        path.addLine(to: CGPoint(x: width, y: height))
        path.addLine(to: CGPoint(x: width, y: 0))
        
        path.addRoundedRect(
            in: CGRect(
                x: 0,
                y: -cornerRadius,
                width: width,
                height: cornerRadius * 2
            ),
            cornerSize: CGSize(width: 20, height: 20)
        )
    }
}

struct TopCornerMask: View {
    var body: some View {
        topCornerMask()
    }
}

#if DEBUG
struct TopCornerMask_Previews: PreviewProvider {
    static var previews: some View {
        VStack {
            TopCornerMask()
            Color.red.clipShape(topCornerMask())
        }
    }
}
#endif
