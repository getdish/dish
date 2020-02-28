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

  @State var isTapped = false
  @State var lastTap = Date()

  func callbackAction() {
    if let cb = self.action { cb() }
  }

  var body: some View {
    self.content
      // ⚠️ dont put .animation() here or every subview animates
      .scaleEffect(self.isTapped ? self.scaleEffect : 1)
      .opacity(self.isTapped ? self.opacityEffect : 1)
      .onTapGesture(perform: self.onTap)
      .onLongPressGesture(
        minimumDuration: 10000,
        maximumDistance: 8,
        pressing: self.onPressing,
        perform: self.onPressed
      )
  }

  func onPressing(_ isPressing: Bool) {
    withAnimation(.spring()) {
      self.isTapped = isPressing
    }
    if isPressing {
      self.lastTap = Date()
    } else {
      //                self.callbackAction()
    }
  }

  func onPressed() {
    if self.lastTap.timeIntervalSinceNow > 10 {
      self.callbackAction()
    }
  }

  func onTap() {
    self.lastTap = Date()
    self.callbackAction()
  }
}
