import Combine
import SwiftUI

struct DishCamera: View {
  @Environment(\.geometry) var appGeometry
  @EnvironmentObject var store: AppStore
  @State var isOpen = false
  var cancel: AnyCancellable?

  var isCaptured: Binding<Bool> {
    Binding<Bool>(
      get: {
        if self.store.state.home.view != .camera {
          return true
        } else {
          return self.store.state.camera.didCapture
        }
      },
      set: { App.store.send(.camera(.capture($0))) }
    )
  }

  var body: some View {
    ZStack {
      CameraView(
        isCaptured: self.isCaptured
      )

      DishCameraPictureTakenOverlay()

      BottomSheetView(
        isOpen: $isOpen,
        maxHeight: App.screen.height * 0.7,
        minHeight: -100
      ) {
        DishRestaurantDrawer()
      }

      DishCameraControls()
    }
      .frameLimitedToScreen()
      .allowsHitTesting(self.store.state.home.view == .camera)
      .clipped()
  }
}

struct DishCameraControls: View {
  @EnvironmentObject var screen: ScreenModel

  var body: some View {
    ZStack {
      VStack {
        Spacer()
        HStack {
          DishCameraBackButton()
          Spacer()
        }

        HStack {
          Spacer()
          DishCameraCaptureButton()
          Spacer()
        }
      }
        .padding(.horizontal, 30)
        .padding(.bottom, screen.edgeInsets.bottom + 20)
    }
  }
}

struct DishCameraCaptureButton: View {
  var body: some View {
    VStack {
      Color.clear
    }
      .background(
        LinearGradient(
          gradient: Gradient(colors: [
            Color.black.opacity(0),
            Color.black.opacity(0.3),
          ]),
          startPoint: .top,
          endPoint: .bottom
        )
      )
      .frame(width: 80, height: 80)
      .cornerRadius(80)
      .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 8)
      .overlay(
        RoundedRectangle(cornerRadius: 80)
          .stroke(Color.black.opacity(1), lineWidth: 2)
          .padding(2)
      )
      .overlay(
        RoundedRectangle(cornerRadius: 80)
          .stroke(Color.white.opacity(1), lineWidth: 2)
      )
  }
}

struct DishCameraBackButton: View {
  @EnvironmentObject var store: AppStore

  var body: some View {
    DishButton(action: {
      if self.store.state.camera.didCapture {
        App.store.send(.camera(.capture(false)))
      } else {
        App.store.send(.home(.setView(.home)))
      }
    }) { 
      Image(systemName: "chevron.left")
        .resizable()
        .scaledToFit()
        .frame(width: 22, height: 22)
        .foregroundColor(Color.white)
        .shadow(color: Color.black, radius: 6)
    }
  }
}

struct DishCameraPictureTakenOverlay: View {
  var body: some View {
    print("Render camera picture overlay")
    return ZStack {
      VStack {
        Spacer()

        ZStack {
          BlurView(style: .extraLight)

          VStack {
            HStack(spacing: 10) {
              Text("🧂")
                .font(.system(size: 60))

              Text("🧀")
                .font(.system(size: 60))

              Text("🧇")
                .font(.system(size: 60))

              Text("🥗")
                .font(.system(size: 60))

              Text("🍻")
                .font(.system(size: 60))

              Text("🍩")
                .font(.system(size: 60))
            }
              .frame(height: 74)

            Spacer().frame(height: 90)
          }
            .frame(maxWidth: .infinity)
            .frame(height: 200)
            .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 0)
        }
          .frame(height: 200)
          .offset(y: false ? 0 : 200)
          .animation(.spring())
      }
    }
  }
}

struct DishRestaurantDrawer: View {
  @State var searchText = ""

  var body: some View {
    VStack(spacing: 3) {
      VStack(spacing: 3) {
        SearchInput(
          placeholder: "Choose restaurant...",
          inputBackgroundColor: Color(.secondarySystemGroupedBackground),
          scale: 1.25,
          sizeRadius: 2.0,
          searchText: self.$searchText
        )
          .padding(.horizontal)
      }

      ScrollView {
        List {
          HStack {
            Image("hiddenlake.jpg")
            Text("Pancho Villa Taqueria")
          }
        }
      }
        .padding(.horizontal, 6)
    }
  }
}

#if DEBUG
  struct DishCamera_Previews: PreviewProvider {
    static var previews: some View {
      DishCamera()
    }
  }
#endif
