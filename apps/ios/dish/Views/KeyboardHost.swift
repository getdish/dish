import Combine
import SwiftUI

struct KeyboardHost<Content: View>: View {
  var dismissOnTapAway = true
  let view: Content

  @State private var keyboardHeight: CGFloat = 0

  private var keyboardHeightPublisher: AnyPublisher<CGFloat, Never> {
    Publishers.Merge(
      NotificationCenter.default
        .publisher(for: UIResponder.keyboardWillShowNotification)
        .compactMap { $0.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? CGRect }
        .map { $0.height },
      NotificationCenter.default
        .publisher(for: UIResponder.keyboardWillHideNotification)
        .map { _ in CGFloat(0) }
    ).eraseToAnyPublisher()
  }

  // Like HStack or VStack, the only parameter is the view that this view should layout.
  // (It takes one view rather than the multiple views that Stacks can take)
  init(@ViewBuilder content: () -> Content) {
    view = content()
  }

  var body: some View {
    ZStack {
      if self.dismissOnTapAway && self.keyboardHeight != 0.0 {
        Color.clear
          .onTapGesture { closeCurrentKeyboard() }
      }
      VStack {
        view
        Rectangle()
          .frame(height: keyboardHeight)
          .animation(.default)
          .foregroundColor(.clear)
      }.onReceive(self.keyboardHeightPublisher) { self.keyboardHeight = $0 }
    }
  }
}

func closeCurrentKeyboard() {
  let keyWindow = UIApplication.shared.connectedScenes
    .filter({ $0.activationState == .foregroundActive })
    .map({ $0 as? UIWindowScene })
    .compactMap({ $0 })
    .first?.windows
    .filter({ $0.isKeyWindow }).first
  keyWindow?.endEditing(true)
}
