import SwiftUI

struct DishAccount: View {
  @EnvironmentObject var store: AppStore

  var body: some View {
    ZStack {
      Color.black

      LoginSignupView()
    }
      .allowsHitTesting(self.store.state.home.view == .me)
      .environment(\.colorScheme, .dark)
  }
}
