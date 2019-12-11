import SwiftUI

struct HomeMap: View {
    @SwiftUI.Environment(\.colorScheme) var colorScheme: ColorScheme
//    @EnvironmentObject var store: Store<AppState, AppAction>
    
    // pushed map below the border radius of the bottomdrawer
    // but why the extra 40?
    let dishMapHeight = Screen.height + Screen.statusBarHeight - Constants.homeInitialDrawerHeight + 40 + 30
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                Rectangle()
                    .foregroundColor(Color(.red))
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                
                MapView(
                    width: geometry.size.width,
                    height: self.dishMapHeight,
                    darkMode: self.colorScheme == .dark
                )
                
                VStack {
                    HStack {
                        Spacer()
                        VStack(spacing: 0) {
                            Button(action: {}) { Image(systemName: "plus.magnifyingglass") }
                                .modifier(MapButtonStyle())
                                .cornerRadius(5, antialiased: true, corners: [.topLeft, .topRight])
                                .shadow(color: Color.black.opacity(0.75), radius: 4, y: 2)
                            Button(action: {}) { Image(systemName: "minus.magnifyingglass") }
                                .modifier(MapButtonStyle())
                                .cornerRadius(5, antialiased: true, corners: [.bottomLeft, .bottomRight])
                                .shadow(color: Color.black.opacity(0.75), radius: 4, y: 2)
                        }
                    }
                    .padding()
                    .frame(maxHeight: .infinity)
                    
                    Spacer()
                }
                .frame(maxHeight: .infinity)
                
                HomeDrawer()
            }
            .clipped()
            .shadow(color: Color.black.opacity(0.25), radius: 20, x: 0, y: 0)
        }
    }
}

struct MapButtonStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(.vertical, 12)
            .padding(.horizontal, 4)
            .background(Color(.tertiarySystemBackground))
    }
}
