import SwiftUI

struct ListItemHScroll<Content>: View where Content: View {
  @Binding var isScrolled: Bool
  var content: Content

  init(isScrolled: Binding<Bool>, @ViewBuilder _ content: @escaping () -> Content) {
    self.content = content()
    self._isScrolled = isScrolled
  }

  var body: some View {
    ScrollView(.horizontal, showsIndicators: false) {
      ScrollListener(throttle: 32.0) { frame in
        if frame.minX < 0 && !self.isScrolled {
          self.isScrolled = true
        } else if frame.minX == 0 && self.isScrolled {
          self.isScrolled = false
        }
      }

      self.content
    }
  }
}
