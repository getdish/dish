import SwiftUI

extension UnitPoint: Identifiable {
  public var id: String { "\(self.x * 1000 + self.y)" }
}

struct InnerShadowView: View {
  var color: Color
  var edges: [UnitPoint]
  var opacity: Float
  var radius: CGFloat
  
  var body: some View {
    ZStack {
      ForEach(edges) { edge in
        self.gradientEdge(edge)
      }
    }
  }
  
  func gradientEdge(_ edge: UnitPoint) -> some View {
    let isVert = edge == .bottom || edge == .top
    let isSide = edge == .leading || edge == .trailing
    
    return HStack {
      if edge == .trailing {
        Spacer()
      }
      VStack {
        if edge == .bottom {
          Spacer()
        }
        LinearGradient(
          gradient: .init(colors: [self.color.opacity(0), self.color]),
          startPoint: .center,
          endPoint: edge
        )
          .frame(
            maxWidth: isSide ? self.radius : .infinity,
            maxHeight: isVert ? self.radius : .infinity
        )
        if edge == .top {
          Spacer()
        }
      }
      if edge == .leading {
        Spacer()
      }
    }
  }
}

extension View {
  func innerShadow(color: Color = Color.black, edges: [UnitPoint], opacity: Float = 0.6, radius: CGFloat = 3.0) -> some View {
    background(
      InnerShadowView(
        color: color,
        edges: edges,
        opacity: opacity,
        radius: radius
      )
    )
  }
  
  func innerGlow(color: Color = Color.black, edges: [UnitPoint], opacity: Float = 0.6, radius: CGFloat = 3.0) -> some View {
    overlay(
      InnerShadowView(
        color: color,
        edges: edges,
        opacity: opacity,
        radius: radius
      )
    )
  }
}
