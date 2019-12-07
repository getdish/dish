// https://stackoverflow.com/questions/56760335/round-specific-corners-swiftui

import SwiftUI

// MARK - Simple fullscreen/frame expand

extension View {
  func frameFlex() -> some View {
    frame(maxWidth: .infinity, maxHeight: .infinity)
  }
}


// MARK - Corner Radius

extension View {
  func cornerRadius(_ radius: CGFloat, antialiased: Bool = true, corners: UIRectCorner) -> some View {
    clipShape(
      RoundedCorner(radius: radius, style: antialiased ? .continuous : .circular, corners: corners)
    )
  }
}

struct RoundedCorner: Shape {
  var radius: CGFloat = .infinity
  var style: RoundedCornerStyle = .continuous
  var corners: UIRectCorner = .allCorners
  
  func path(in rect: CGRect) -> Path {
    let path = UIBezierPath(roundedRect: rect, byRoundingCorners: corners, cornerRadii: CGSize(width: radius, height: radius))
    return Path(path.cgPath)
  }
}
