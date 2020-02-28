import SwiftUI

struct ClearKeyboardOnScroll: View {
  @EnvironmentObject var homeState: HomeViewState
  @EnvironmentObject var keyboard: Keyboard

  var body: some View {
    ScrollListener(onScroll: { frame in
      if self.keyboard.state.height > 0 && abs(frame.minY) > self.homeState.y + 20 {
        print("should hide keyboard")
        self.keyboard.hide()
      }
    })
  }
}
