import SwiftUI
import Combine

struct DishCamera: View {
    @Environment(\.geometry) var appGeometry
    @EnvironmentObject var store: AppStore
    @State var isOpen = false
    var cancel: AnyCancellable?
    
    var isCaptured: Binding<Bool> {
        Binding<Bool>(
            get: {
                if self.store.state.home.showCamera == false {
                    return true
                } else {
                    return self.store.state.camera.didCapture
                }
            },
            set: { App.store.send(.camera(.capture($0))) }
        )
    }
    
    var body: some View {
        return ZStack {
            VStack {
                CameraView(
                    isCaptured: self.isCaptured
                )
            }
            .background(Color.black)
            .frame(minWidth: App.screen.width, maxHeight: .infinity)
            
            CameraBottomNav()
            
            DishCameraPictureOverlay()

            BottomSheetView(
                isOpen: $isOpen,
                maxHeight: App.screen.height * 0.7,
                minHeight: -100
            ) {
                DishRestaurantDrawer()
            }
        }
        .frame(width: appGeometry?.size.width, height: appGeometry?.size.height)
        .allowsHitTesting(self.store.state.home.view == .camera)
        .clipped()
    }
}

struct CameraBottomNav: View {
    @EnvironmentObject var screen: ScreenModel

    var body: some View {
        ZStack {
            VStack {
                Spacer()
                HStack {
                    CameraBackButton()
                    Spacer()
                }
                .padding()
                .padding(.bottom, screen.edgeInsets.bottom)
            }
        }
    }
}

struct CameraBackButton: View {
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        Button(action: {
            if self.store.state.camera.didCapture {
                App.store.send(.camera(.capture(false)))
            } else {
                App.store.send(.home(.setShowCamera(false)))
            }
        }) {
            Image(systemName: "chevron.left")
                .resizable()
                .scaledToFit()
                .frame(width: 26, height: 26)
                .foregroundColor(Color.white)
                .shadow(color: Color.black, radius: 6)
        }
    }
}

struct DishCameraPictureOverlay: View {
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
    @State var tags: [SearchInputTag] = []
    
    var body: some View {
        VStack(spacing: 3) {
            VStack(spacing: 3) {
                SearchInput(
                    placeholder: "Choose restaurant...",
                    inputBackgroundColor: Color(.secondarySystemGroupedBackground),
                    scale: 1.25,
                    sizeRadius: 2.0,
                    searchText: self.$searchText,
                    tags: self.$tags
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
