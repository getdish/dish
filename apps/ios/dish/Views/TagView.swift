import SwiftUI

struct TagView<Content>: View where Content: View {
  let content: () -> Content

  init(@ViewBuilder content: @escaping () -> Content) {
    self.content = content
  }

  var body: some View {
    HStack {
      content()
    }
      .padding(.vertical, 0)
      .padding(.horizontal, 9)
      .background(Color(.tertiarySystemBackground).opacity(0.9))
      .cornerRadius(5)
      .shadow(color: Color.black.opacity(0.18), radius: 2, y: 2)
  }
}
