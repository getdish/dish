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
    
    var icon: Image {
        let isOnHome = Selectors.home.isOnHome()
        let searchFocus = self.store.state.home.searchFocus
        if isOnHome || searchFocus == .search {
            return Image(systemName: "magnifyingglass")
        } else if searchFocus == .location {
            return Image(systemName: "map")
        } else {
            return Image(systemName: "chevron.left")
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
//        let isOnSearch = self.store.state.home.showSearch == .search
        return HStack {
            SearchInput(
                placeholder: "",
                inputBackgroundColor: Color.init(white: 0.5, opacity: 0),
                borderColor: Color.clear, //Color.init(white: 0.5, opacity: 0.1),
                scale: scale,
                sizeRadius: 1.2,
                icon: icon,
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
                    Image(systemName: "camera")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 22, height: 22)
                }
                
            }
            .buttonStyle(NeomorphicStyle())
        }
    }
}

struct NeomorphicStyle: ButtonStyle {
    func makeBody(configuration: Self.Configuration) -> some View {
        let isPressed = configuration.isPressed
//        let x = Color(.systemGroupedBackground)
        let background: Color = isPressed ? Color(.systemBackground) : Color(.systemGroupedBackground)
        let darkShadow: Color = .init(red: 0.9, green: 0.9, blue: 0.9)
        let lightShadow: Color = .init(white: 1, opacity: 1)
        
        return configuration.label
            .padding(10)
            .background(background)
            .cornerRadius(100)
            .shadow(color: isPressed ? lightShadow : darkShadow, radius: 10, x: 10, y: 10)
            .shadow(color: isPressed ? darkShadow : lightShadow, radius: 10, x: -10, y: -10)
    }
}

struct CameraButton: View {
    var foregroundColor: Color = .black
    
    @State var isTapped = false
    @State var lastTap = Date()
    
    @EnvironmentObject var store: AppStore
    @Environment(\.colorScheme) var colorScheme
    
    var body: some View {
        let oppositeColor = colorScheme == .dark ? Color.white : Color.black
        
        return DishButton(action: {
            self.lastTap = Date()
            if self.store.state.home.view != .camera {
                self.store.send(.home(.setView(.camera)))
            } else {
                self.store.send(.camera(.capture(true)))
            }
        }) {
            ZStack {
                Group {
                    Image(systemName: "viewfinder")
                        .resizable()
                        .scaledToFit()
                        .foregroundColor(Color("color-brand").opacity(0.5))
                }
                .foregroundColor(oppositeColor.opacity(0.5))
            }
                .padding(.all, App.cameraButtonHeight * 0.22)
                .frame(width: App.cameraButtonHeight, height: App.cameraButtonHeight)
                .cornerRadius(App.cameraButtonHeight)
                .overlay(
                    RoundedRectangle(cornerRadius: App.cameraButtonHeight)
                        .stroke(oppositeColor.opacity(0.1), lineWidth: 1)
            )
        }
    }
}

#if DEBUG
struct CameraButton_Previews: PreviewProvider {
    static var previews: some View {
        HomeSearchBar()
            .embedInAppEnvironment()
    }
}
#endif
