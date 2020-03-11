import SwiftUI

struct AccountView: View {
  @EnvironmentObject var store: AppStore

  var body: some View {
    ZStack {
      AccountLoginSignupView()
    }
      .allowsHitTesting(self.store.state.view == .me)
  }
}
