import SwiftUI

struct CutoutCircleCentered: View {
  var rect: CGRect
  var circleSize: CGFloat = 50

  var body: some View {
    Path { path in
      path.circleCutout(rect: rect, circleSize: circleSize)
    }
  }
}

extension Path {
  mutating func circleCutout(
    rect: CGRect, circleSize: CGFloat, x: CGFloat? = nil, y: CGFloat? = nil
  ) {
    self.move(to: CGPoint(x: 0, y: 0))
    self.addLine(to: CGPoint(x: 0, y: rect.height))
    self.addLine(to: CGPoint(x: rect.width, y: rect.height))
    self.addLine(to: CGPoint(x: rect.width, y: 0))
    self.addEllipse(
      in:
        CGRect(
          x: x ?? rect.width - circleSize - 20,
          y: y ?? rect.height * 0.8 - circleSize / 2,
          width: circleSize,
          height: circleSize
        )
    )
  }

}

fileprivate let cardFrame = CGRect(x: 0, y: 0, width: 400, height: 200)
fileprivate var clipPath = Path()

#if DEBUG
  struct CardCutoutControls_Previews: PreviewProvider {
    init() {
      // INIT
      clipPath.circleCutout(rect: cardFrame, circleSize: 60)
    }

    static var previews: some View {
      VStack {
        CutoutCircleCentered(rect: cardFrame)

        VStack {
          Color.red
        }
          .clipShape(clipPath)
      }
    }
  }
#endif
