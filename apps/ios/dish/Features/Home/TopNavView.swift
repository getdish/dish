import SwiftUI
import CoreLocation

struct TopNavViewContent: View {
    @EnvironmentObject var screen: ScreenModel
    
    var body: some View {
        let bottomPad = CGFloat(5)
        let topPad = screen.edgeInsets.top
        let totalHeight = topPad + bottomPad + 40
        
        return VStack {
            ZStack {                
                VStack {
                    VStack {
                        HStack(spacing: 12) {
                            ZStack {
                                TopNavHome()
                                CameraTopNav()
                            }
                        }
                        .padding(.horizontal, 8)
                    }
                    .padding(.top, topPad)
                    .padding(.bottom, bottomPad)
                    .frame(maxHeight: totalHeight, alignment: Alignment.top)
                    
                    Spacer()
                }
            }
        }
        .padding(.top, 4)
    }
}

struct TopNavButtonStyle: ViewModifier {
    @Environment(\.colorScheme) var colorScheme
    
    var height: CGFloat = 35
    var hPad: CGFloat = 11
    
    func body(content: Content) -> some View {
        ZStack {
            Group {
                if colorScheme == .dark {
                    content
                        .frame(height: self.height)
                        .padding(.horizontal, self.hPad)
                        .background(Color.black.opacity(0.2))
                        .background(BlurView(style: .systemThickMaterialDark))
                } else {
                    content
                        .frame(height: self.height)
                        .padding(.horizontal, self.hPad)
                        .background(Color.white.opacity(0.025))
                        .background(Color.black.opacity(0.025))
                        .background(BlurView(style: .systemUltraThinMaterialDark))
                    
                }
            }
            .cornerRadius(8)
            .shadow(color: Color.black.opacity(0.15), radius: 4, x: 0, y: 2)
            .foregroundColor(.white)
        }
        .padding(3)
    }
}

struct SearchBarLocationLabel: View {
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        let mapLabel = self.store.state.map.locationLabel
        let label = mapLabel == "" ? "Map Area" : mapLabel
        
        return HStack {
            Button(action: {
                App.store.send(.map(.moveToCurrentLocation))
            }) {
                Text(label)
                    .font(.system(size: 16))
            }
            .modifier(TopNavButtonStyle())
        }
    }
}

struct TopNavHome: View {
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        let homeView = store.state.home.view
        let isOnHome = homeView == .home
        let isOnLocationSearch = store.state.home.showSearch == .location
        
        return ZStack {
            VStack {
                ZStack {
                    HStack {
                        Spacer()
                        SearchBarLocationLabel()
                        Spacer()
                    }
                    
                    // home controls
                    HStack(spacing: 4) {
                        Button(action: {
                        }) {
                            VStack {
                                Image(systemName: "person")
                                    .resizable()
                                    .scaledToFit()
                                    .frame(width: 16, height: 16)
                            }
                        }
                        .modifier(TopNavButtonStyle())
                        
                        Spacer()

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
                    .offset(y: isOnLocationSearch ? -100 : 0)
                    .animation(.spring())
                }
                .opacity(isOnHome ? 1 : 0)
            }
            .frame(maxWidth: .infinity)
        }
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

#if DEBUG
struct TopNav_Previews: PreviewProvider {
    static var previews: some View {
        VStack {
            TopNavViewContent()
        }
        .embedInAppEnvironment()
        .background(
            LinearGradient(gradient: Gradient(colors: [.white, .red]), startPoint: .top, endPoint: .bottom)
        )
    }
}
#endif
