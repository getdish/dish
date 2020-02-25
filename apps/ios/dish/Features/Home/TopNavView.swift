import SwiftUI
import CoreLocation

struct TopNavView: View {
    @Environment(\.colorScheme) var colorScheme
    @EnvironmentObject var screen: ScreenModel
    @EnvironmentObject var store: AppStore
    @State var isOpen = false
    
    var topPad: CGFloat {
        screen.edgeInsets.top
    }
    
    var body: some View {
        // TODO there was a perf regression on map panning smoothness with TopSheetView
//        TopSheetView(
//            isOpen: self.$isOpen,
//            maxHeight: self.screen.height * 0.8,
//            minHeight: screen.edgeInsets.top + 50
//        ) {
            VStack {
                HStack(spacing: 10) {
                    self.accountButton
                    TopNavLocationSearchBarView()
                    self.cameraButton
                }
                Spacer()
            }
            .padding(.top, topPad)
            .padding(.horizontal, 8)
            .padding(.bottom, 8)
//        }
    }
    
    var accountButton: some View {
        Button(action: {
        }) {
            Image(systemName: "person")
                .resizable()
                .scaledToFit()
                .frame(width: 16, height: 16)
        }
        .modifier(TopNavButtonStyle())
    }
    
    var cameraButton: some View {
        Button(action: {
            App.enterRepl = true
        }) {
            VStack {
                Image(systemName: "camera")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 22, height: 22)
            }
            
        }
        .modifier(TopNavButtonStyle())
    }
}

struct CameraTopNav: View {
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

struct TopNavButtonStyle: ViewModifier {
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
                        .background(Color.black.opacity(active ? 0.4 : 0.8))
                        .background(showBlurBackground ? BlurView(style: active ? .systemMaterialLight : .systemMaterial) : nil)
                } else {
                    content
                        .frame(height: self.height)
                        .padding(.horizontal, self.hPad)
                        .background(Color.white.opacity(active ? 0.5 : 0.2))
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
struct TopNav_Previews: PreviewProvider {
    static var previews: some View {
        VStack {
            TopNavView()
        }
        .embedInAppEnvironment()
        .background(
            LinearGradient(gradient: Gradient(colors: [.white, .red]), startPoint: .top, endPoint: .bottom)
        )
    }
}
#endif
