import CoreLocation
import SwiftUI

struct ControlsBar: View, Equatable {
  static func == (lhs: ControlsBar, rhs: ControlsBar) -> Bool {
    true
  }

  @Environment(\.colorScheme) var colorScheme
  @EnvironmentObject var screen: ScreenModel
  @EnvironmentObject var store: AppStore
  @State var isOpen = false

  var topPad: CGFloat {
    screen.edgeInsets.top
  }

  var body: some View {
    VStack {
      HStack(spacing: 10) {
        self.accountButton
        ControlsLocationSearchBarView()
        self.locationButton
      }
      Spacer()
    }
      .padding(.top, topPad)
      .padding(.horizontal, 8)
      .padding(.bottom, 8)
  }

  var accountButton: some View {
    Button(action: {
      App.store.send(.home(.setView(.me)))
    }) {
      Image(systemName: "person.fill")
        .resizable()
        .scaledToFit()
        .frame(width: 16, height: 16)
    }
      .modifier(ControlsButtonStyle())
  }

  var locationButton: some View {
    Button(action: {
      App.store.send(.map(.moveToCurrentLocation))
    }) {
      VStack {
        Image(
          systemName: self.store.state.map.location.center == .current
            ? "location" : "location.fill")
          .resizable()
          .scaledToFit()
          .frame(width: 16, height: 16)
      }

    }
      .modifier(ControlsButtonStyle())
  }
}

struct CameraControls: View {
  @EnvironmentObject var store: AppStore

  var body: some View {
    let homeView = self.store.state.home.view
    let isOnCamera = homeView == .camera

    return HStack {
      Button(action: {
        }) {
          VStack {
            Text("@ Pancho Villa Taqueria")
              .fontWeight(.bold)
          }
            .padding(.vertical, 4)
            .padding(.horizontal, 8)
            .background(Color.white.opacity(0.2))
            .cornerRadius(20)
            .onTapGesture {
              //                                    Store.camera.showRestaurantDrawer.toggle()
            }
        }
        .foregroundColor(.white)
        .opacity(isOnCamera ? 1 : 0)
        .animation(
          Animation.spring().delay(!isOnCamera ? 0 : 0.25)
        )

      Spacer()
    }
  }
}

struct ControlsButtonStyle: ViewModifier {
  @Environment(\.colorScheme) var colorScheme

  var active: Bool = false
  var background: Color = .clear
  var height: CGFloat = 34
  var hPad: CGFloat = 11
  var showBlurBackground: Bool = true

  func body(content: Content) -> some View {
    ZStack {
      Group {
        if colorScheme == .dark {
          content
            .frame(height: self.height)
            .padding(.horizontal, self.hPad)
            .foregroundColor(.white)
            .background(Color.black.opacity(active ? 0 : 0.3))
            .background(showBlurBackground ? BlurView(style: .systemThinMaterialDark) : nil)
        } else {
          content
            .frame(height: self.height)
            .padding(.horizontal, self.hPad)
            .background(Color.white.opacity(active ? 0 : 0.2))
            .foregroundColor(.white)
            .background(showBlurBackground ? BlurView(style: .systemThinMaterialDark) : nil)
        }
      }
        .background(self.background)
        .cornerRadius(8)
        .shadow(color: Color.black.opacity(0.15), radius: 3, x: 0, y: 1)
    }
      .padding(3)
  }
}

#if DEBUG
  struct Controls_Previews: PreviewProvider {
    static var previews: some View {
      VStack {
        ControlsBar()
      }
        .embedInAppEnvironment()
        .background(
          LinearGradient(
            gradient: Gradient(colors: [.white, .red]), startPoint: .top, endPoint: .bottom)
        )
    }
  }
#endif
