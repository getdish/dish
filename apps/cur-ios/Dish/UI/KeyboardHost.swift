import SwiftUI

struct KeyboardHost<Content: View>: View {
  var dismissOnTapAway = true
  let view: Content
  
  @State private var keyboardHeight: CGFloat = 0
  
  private let showPublisher = NotificationCenter.Publisher.init(
    center: .default,
    name: UIResponder.keyboardWillShowNotification
  ).map { (notification) -> CGFloat in
    if let rect = notification.userInfo?["UIKeyboardFrameEndUserInfoKey"] as? CGRect {
      return rect.size.height
    } else {
      return 0
    }
  }
  
  private let hidePublisher = NotificationCenter.Publisher.init(
    center: .default,
    name: UIResponder.keyboardWillHideNotification
  ).map {_ -> CGFloat in 0}
  
  // Like HStack or VStack, the only parameter is the view that this view should layout.
  // (It takes one view rather than the multiple views that Stacks can take)
  init(@ViewBuilder content: () -> Content) {
    view = content()
  }
  
  var body: some View {
    ZStack {
      if self.dismissOnTapAway && self.keyboardHeight != 0.0 {
        Rectangle()
          .frame(maxWidth: .infinity, maxHeight: .infinity)
          .foregroundColor(.clear)
          .onTapGesture {
            closeCurrentKeyboard()
          }
      }
      
      VStack {
        view
        Rectangle()
          .frame(height: keyboardHeight)
          .animation(.default)
          .foregroundColor(.clear)
      }.onReceive(showPublisher.merge(with: hidePublisher)) { (height) in
        self.keyboardHeight = height
      }
    }
  }
}

func closeCurrentKeyboard() {
  let keyWindow = UIApplication.shared.connectedScenes
    .filter({$0.activationState == .foregroundActive})
    .map({$0 as? UIWindowScene})
    .compactMap({$0})
    .first?.windows
    .filter({$0.isKeyWindow}).first
  keyWindow?.endEditing(true)
}
