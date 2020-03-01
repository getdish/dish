import SwiftUI

struct DishButton<Content: View>: View {
  typealias Action = (() -> Void)

  init(
    action: Action? = nil,
    opacityEffect: Double = 0.9,
    scaleEffect: CGFloat = 0.9,
    @ViewBuilder content: () -> Content
  ) {
    self.content = content()
    self.action = action
    self.opacityEffect = opacityEffect
    self.scaleEffect = scaleEffect
  }

  var action: Action? = nil
  var opacityEffect: Double
  var scaleEffect: CGFloat
  var content: Content

  @State var isPressed = false
  @State var lastTap = Date()

  private func callbackAction() {
    if let cb = self.action { cb() }
  }

  var body: some View {
    self.content
      // ⚠️ dont put .animation() here or every subview animates
      .scaleEffect(self.isPressed ? self.scaleEffect : 1)
      .opacity(self.isPressed ? self.opacityEffect : 1)
      .onTapGesture(perform: self.handleTap)
      .onLongPressGesture(
        minimumDuration: 10000,
        maximumDistance: 8,
        pressing: self.handlePress,
        perform: self.handlePerform
      )
  }

  private func handlePress(_ isPressing: Bool) {
    withAnimation(.spring()) {
      self.isPressed = isPressing
    }
    if isPressing {
      self.lastTap = Date()
    } else {
      //                self.callbackAction()
    }
  }

  private func handlePerform() {
    if self.lastTap.timeIntervalSinceNow > 10 {
      self.callbackAction()
    }
  }

  private func handleTap() {
    self.lastTap = Date()
    self.callbackAction()
  }
}
