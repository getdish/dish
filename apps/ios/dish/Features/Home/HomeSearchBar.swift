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
        log.info()
        self.isFirstResponder = false
        async(2) {
            self.isFirstResponder = true
        }
    }
    
    @State var lastZoomed = false
    
    var icon: AnyView {
        let isOnHome = Selectors.home.isOnHome()
        if isOnHome || self.store.state.home.showSearch == .search {
            return AnyView(
                Image(systemName: "magnifyingglass")
            )
        } else if self.store.state.home.showSearch == .location {
            return AnyView(
                Image(systemName: "map")
            )
        } else {
            return AnyView(
                Image(systemName: "chevron.left")
            )
        }
    }
    
    let after = AnyView(HomeSearchBarAfterView(scale: 1.2))
    
    func onClear() {
        // go back on empty search clear
        self.store.send(.home(.clearSearch))

        // focus keyboard again on clear if not focused
        if self.keyboard.state.height == 0 {
            self.focusKeyboard()
        }
    }
    
    var body: some View {
        let zoomed = keyboard.state.height > 0
        let scale: CGFloat = zoomed ? 1.2 : 1.2
        let isOnSearch = self.store.state.home.showSearch == .search
        
        return ZStack {
            Group {
                if self.lastZoomed != zoomed {
                    SideEffect("updateLastZoomed") {
                        self.lastZoomed = zoomed
                    }
                }
            }
            
            SearchInput(
                placeholder: "",
                inputBackgroundColor: Color.white,
                borderColor: Color.white,
                scale: scale,
                sizeRadius: 2.25,
                icon: icon,
                showCancelInside: true,
                onTapLeadingIcon: {
                    if Selectors.home.isOnHome() {
                        self.isFirstResponder = true
                    } else {
                        self.keyboard.hide()
                        self.store.send(.home(.pop))
                    }
                },
                onEditingChanged: { val in
                    if val == true {
                        App.store.send(.home(.setShowSearch(.search)))
                    } else {
                        // todo we may need to not auto close...?
                        App.store.send(.home(.setShowSearch(.off)))
                    }
                },
                onClear: self.onClear,
                after: isOnSearch ? AnyView(EmptyView()) : after,
                isFirstResponder: isFirstResponder,
                searchText: self.homeSearch,
                showInput: showInput
            )
                .shadow(color: Color.black.opacity(isOnSearch ? 0 : 0.35), radius: 8, x: 0, y: 3)
                .overlay(RoundedRectangle(cornerRadius: 80)
                    .stroke(Color.black.opacity(isOnSearch ? 0.1 : 0), lineWidth: 1)
                )
                .animation(.spring(), value: zoomed != self.lastZoomed)
        }
    }
}

struct HomeSearchBarAfterView: View {
    @Environment(\.colorScheme) var colorScheme
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var homeState: HomeViewState

    var scale: CGFloat
    
    var body: some View {
        let oppositeColor = colorScheme == .dark ? Color.white : Color.black
        
        return HStack {
            Button(action: {
                self.homeState.toggleSnappedToBottom()
            }) {
                Group {
                    if self.homeState.isSnappedToBottom {
                        if Selectors.home.isOnSearchResults() {
                            Image(systemName: "list.bullet")
                                .resizable()
                                .scaledToFit()
                        } else {
                            Image(systemName: "chevron.up")
                                .resizable()
                                .scaledToFit()
                        }
                    }
                    else {
                        if Selectors.home.isOnSearchResults() {
                            Image(systemName: "map")
                                .resizable()
                                .scaledToFit()
                        } else {
                            Image(systemName: "chevron.down")
                                .resizable()
                                .scaledToFit()
                        }
                    }
                }
                .frame(width: 14 * scale, height: 14 * scale)
                .opacity(0.5)
            }
            .padding(.vertical, 4 * scale)
            .padding(.horizontal, 6 * scale)
            
            // space for the camera button
//            Color.clear
//                .frame(width: App.cameraButtonHeight)
        }
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
        CameraButton()
    }
}
#endif
