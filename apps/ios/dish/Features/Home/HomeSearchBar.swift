import SwiftUI

// this can be expanded to handle types of filters
struct SearchToTagColor {
    static let dish = Color(red: 0.2, green: 0.4, blue: 0.7, opacity: 0.5)
    static let filter = Color(red: 0.6, green: 0.2, blue: 0.4, opacity: 0.5)
}

struct HomeSearchBar: View {
    var showInput = true
    
    @State var searchText = ""
    @State var textField: UITextField? = nil
    @State var isFirstResponder = false
    @EnvironmentObject var screen: ScreenModel
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var keyboard: Keyboard
    @Environment(\.colorScheme) var colorScheme
    
    var hasSearch: Bool {
        store.state.home.viewStates.count > 1
    }
    
    private var homeSearch: Binding<String> {
        store.binding(for: \.home.viewStates.last!.search, { .home(.setSearch($0)) })
    }
    
    private var homeLocation: Binding<String> {
        store.binding(for: \.map.locationLabel, { .map(.setLocationLabel($0)) })
    }
    
    func focusKeyboard() {
        logger.info()
        self.isFirstResponder = false
        async(2) {
            self.isFirstResponder = true
        }
    }
    
    func onClear() {
        // go back on empty search clear
        self.store.send(.home(.clearSearch))
    }
    
    func onTapLeadingIcon() {
        if Selectors.home.isOnHome() {
            self.isFirstResponder = true
        } else {
            self.keyboard.hide()
            self.store.send(.home(.pop))
        }
    }
    
    func onEditingChanged(_ val: Bool) {
        if val {
            App.store.send(.home(.setSearchFocus(.search)))
        } else {
            async {
                if self.store.state.home.searchFocus == .search {
                    App.store.send(.home(.setSearchFocus(.off)))
                }
            }
        }
    }
    
    var body: some View {
        let scale: CGFloat = 1
        let isOnHome = Selectors.home.isOnHome()
        let searchFocus = self.store.state.home.searchFocus
        let showSearchIcon = isOnHome || searchFocus == .search
        var iconSize: CGFloat = 20
        let icon: Image = {
            if showSearchIcon {
                return Image(systemName: "magnifyingglass")
            } else if searchFocus == .location {
                return Image(systemName: "map")
            } else {
                iconSize = 16
                return Image(systemName: "chevron.left")
            }
        }()
        
//        let isOnSearch = self.store.state.home.showSearch == .search
        return HStack {
            SearchInput(
                placeholder: "",
                inputBackgroundColor: Color.init(white: 0.5, opacity: 0),
                borderColor: Color.clear, //Color.init(white: 0.5, opacity: 0.1),
                scale: scale,
                sizeRadius: 1.2,
                icon: icon,
                iconSize: iconSize,
                showCancelInside: true,
                onTapLeadingIcon: self.onTapLeadingIcon,
                onEditingChanged: self.onEditingChanged,
                onClear: self.onClear,
                isFirstResponder: isFirstResponder,
                searchText: self.homeSearch,
                showInput: showInput
            )
            
            Button(action: {
                App.enterRepl = true
            }) {
                VStack {
                    Image(systemName: "camera.fill")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 28, height: 28)
                }
                
            }
            .buttonStyle(IndentedStyle(
                colorScheme: self.colorScheme,
                rgb: Selectors.home.activeLense().rgb
            ))
        }
    }
}

struct IndentedStyle: ButtonStyle {
    var colorScheme: ColorScheme
    var rgb: [Double]
    
    var bg: Color {
        Color(red: rgb[0] * 0.8, green: rgb[1] * 0.8, blue: rgb[2] * 0.8)
    }
    
    var bgDark: Color {
        Color(red: rgb[0] * 0.65, green: rgb[1] * 0.65, blue: rgb[2] * 0.65)
    }
    
    var darkShadow: Color {
        Color(red: rgb[0] * 0.5, green: rgb[1] * 0.5, blue: rgb[2] * 0.5)
    }
    
    var lightShadow: Color {
        Color(red: rgb[0] * 1.2, green: rgb[1] * 1.2, blue: rgb[2] * 1.2)
    }
    
    func makeBody(configuration: Self.Configuration) -> some View {
        let isPressed = configuration.isPressed
//        let x = Color(.systemGroupedBackground)
        let background: Color = isPressed ? self.bg : self.bgDark
        
        return configuration.label
            .foregroundColor(Color(white: 0.35, opacity: 0.5))
            .padding(16)
            .background(
                LinearGradient(
                    gradient: .init(colors: isPressed
                        ? [background, background]
                        : [lightShadow, background]
                    ),
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .cornerRadius(100)
            .shadow(color: isPressed ? lightShadow : darkShadow, radius: 10, x: 10, y: 10)
            .shadow(color: isPressed ? darkShadow : lightShadow, radius: 10, x: -10, y: -10)
            .animation(.spring(response: 0.3))
    }
}

#if DEBUG
struct HomeSearchBar_Previews: PreviewProvider {
    static var previews: some View {
        HomeSearchBar()
            .embedInAppEnvironment()
    }
}
#endif
