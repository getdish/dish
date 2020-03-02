import SwiftUI

struct AccountView: View {
  @EnvironmentObject var store: AppStore

  var body: some View {
    ZStack {
      Color.black
      AccountLoginSignupView()
    }
      .allowsHitTesting(self.store.state.view == .me)
      .environment(\.colorScheme, .dark)
  }
}
