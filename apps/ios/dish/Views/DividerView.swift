import SwiftUI

struct DividerView: View {
  enum DividerDirection {
    case horizontal, vertical
  }

  @Environment(\.colorScheme) var colorScheme

  var direction: DividerDirection
  var opacity: Double

  init(
    _ direction: DividerDirection = .horizontal,
    opacity: Double = 0.1
  ) {
    self.direction = direction
    self.opacity = opacity
  }

  var body: some View {
    let color = Color(self.colorScheme == .dark ? .white : .black)
      .opacity(self.opacity)
    return Group {
      if self.direction == .horizontal {
        color.frame(height: 1).padding(.horizontal)
      } else {
        color.frame(width: 1).padding(.vertical)
      }
    }
  }
}
