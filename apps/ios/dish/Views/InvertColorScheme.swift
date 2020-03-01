import SwiftUI

struct InvertColorScheme<Content>: View where Content: View {
  var invert: Bool
  var content: Content

  @Environment(\.colorScheme) var colorScheme

  init(_ invert: Bool = true, @ViewBuilder content: @escaping () -> Content) {
    self.invert = invert
    self.content = content()
  }

  var body: some View {
    self.content
      .environment(
        \.colorScheme,
        self.invert
          ? self.colorScheme == .dark ? .light : .dark
          : self.colorScheme)
  }
}

extension View {
  func invertColorScheme(_ val: Bool = true) -> some View {
    InvertColorScheme(val) {
      self
    }
  }
}
