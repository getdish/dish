import SwiftUI
import Combine

struct DishCamera: View {
  @ObservedObject var cameraStore = Store.camera
  @State var isCaptured = true
  var cancel: AnyCancellable?
  
  init() {
    self.cancel = Store.home.$currentPage
      .map { $0 == .home }
      .assign(to: \.isCaptured, on: self)
  }
  
  var body: some View {
    return ZStack {
      VStack {
        CameraView(
          isCaptured: self.$isCaptured
        )
      }
      .background(Color.orange)
      .frame(minWidth: Screen.width, maxHeight: .infinity)
      
      DishCameraPictureOverlay()
      
      DrawerView(
        isShow: $cameraStore.showRestaurantDrawer,
        defaultHeight: 0,
        fullHeight: initialDrawerFullHeight,
        hiddenHeight: 0,
        drawerBackgroundColor: Color(.systemBackground),
        content: DishRestaurantDrawer()
      )
    }
    .clipped()
  }
}

struct DishCameraPictureOverlay: View {
  @ObservedObject var cameraStore = Store.camera
  
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
        .offset(y: self.cameraStore.isCaptured ? 0 : 200)
        .animation(.spring())
      }
      .frameFlex()
    }
    .frameFlex()
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
