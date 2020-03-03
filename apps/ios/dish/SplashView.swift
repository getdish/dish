import SwiftUI

struct SplashView: View {
  @EnvironmentObject var store: AppStore

  var body: some View {
    let size: CGFloat = self.store.state.showSplash
      ? 1000
      : 0
    
    return ZStack {
      Color("color-brand-background")
        .frame(width: size, height: size)
        .cornerRadius(1000)
        .frameLimitedToScreen()
        .animation(.spring())
      
      VStack {
        if self.store.state.showSplash {
          VStack {
            Image("LaunchScreen2")
              .resizable()
              .scaledToFill()
//              .mask(
//                Circle().frame(width: 200, height: 200)
//            )
          }
          .transition(.fly)
        }
      }
    }
    .frameLimitedToScreen()
  }
}
