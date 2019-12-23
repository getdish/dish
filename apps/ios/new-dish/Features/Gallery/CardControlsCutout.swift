import SwiftUI

struct CardControlsCutout: View {
    var rect: CGRect
    var circleSize: CGFloat = 50
    
    var body: some View {
        Path { path in
            path.cardControlsCutout(rect: rect, circleSize: circleSize)
        }
    }
}

extension Path {
    mutating func cardControlsCutout(rect: CGRect, circleSize: CGFloat) {
        self.move(to: CGPoint(x: 0, y: 0))
        self.addLine(to: CGPoint(x: 0, y: rect.height))
        self.addLine(to: CGPoint(x: rect.width, y: rect.height))
        self.addLine(to: CGPoint(x: rect.width, y: 0))
        self.addEllipse(in:
            CGRect(
                x: rect.width - circleSize - 20,
                y: rect.height * 0.8 - circleSize / 2,
                width: circleSize,
                height: circleSize
            )
        )
    }

}

struct Cutout2 {
    let cardFrame = CGRect(x: 0, y: 0, width: 400, height: 200)
    var clipPath = Path()
    init() {
        clipPath.cardControlsCutout(rect: cardFrame, circleSize: 60)
    }
}

let clipPath2 = Cutout2()

#if DEBUG
struct CardCutoutControls_Previews: PreviewProvider {
    static var previews: some View {
        VStack {
            CardControlsCutout(rect: clipPath2.cardFrame)
            
            VStack {
                Color.red
            }
                .clipShape(clipPath)
        }
    }
}
#endif
