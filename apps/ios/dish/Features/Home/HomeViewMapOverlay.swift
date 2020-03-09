import SwiftUI

struct HomeViewMapOverlay: View {
  @EnvironmentObject var screen: ScreenModel
  @Environment(\.colorScheme) var colorScheme
  
  var body: some View {
    VStack {
      Spacer()
      ZStack {
        self.colorScheme == .dark
          ? LinearGradient(
            gradient: Gradient(colors: [
              .clear,
              Color(white: 1, opacity: 0.6)
            ]),
            startPoint: .top,
            endPoint: .bottom
            )
          : LinearGradient(
            gradient: Gradient(colors: [
              Color.clear,
              Color(white: 1, opacity: 1)
            ]),
            startPoint: .top,
            endPoint: .bottom
        )
      }
      .frame(height: self.screen.height * 0.6)
      .drawingGroup()
    }
    .allowsHitTesting(false)
    .disabled(true)
  }
}
