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
      
      if self.store.state.showSplash {      
        VStack {
          Spacer()
          HStack {
            Image(systemName: "slowmo")
              .foregroundColor(.white)
              .opacity(0.5)
              .rotationEffect(.degrees(360))
              .animation(Animation.linear(duration: 1).repeatForever())
          }
        }
        .padding(50)
      }
      
      VStack {
        if self.store.state.showSplash {
          VStack {
            Image("LaunchScreen2")
              .resizable()
              .scaledToFill()
          }
          .transition(.fly)
        }
      }
    }
    .frameLimitedToScreen()
  }
}
