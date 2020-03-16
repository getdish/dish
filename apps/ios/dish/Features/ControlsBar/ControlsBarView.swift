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
    DishButton(action: {
      self.store.send(.setView(.me))
    }) {
      Image(systemName: "person.fill")
        .resizable()
        .scaledToFit()
        .frame(width: 16, height: 16)
    }
      .controlButtonStyle()
  }

  var locationButton: some View {
    DishButton(action: {
      self.store.send(.map(.moveToCurrentLocation))
    }) {
      VStack {
        Image(
          systemName: self.store.state.home.location.center == .current
            ? "location" : "location.fill")
          .resizable()
          .scaledToFit()
          .frame(width: 16, height: 16)
      }

    }
      .controlButtonStyle()
  }
}

struct CameraControls: View {
  @EnvironmentObject var store: AppStore

  var body: some View {
    let homeView = self.store.state.view
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
