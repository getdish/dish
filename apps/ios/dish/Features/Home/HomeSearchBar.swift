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
    
    @State var placeholder = "Dim Sum..."
    
    func updatePlaceholder() {
        var i = 0
        let placeholders = ["Dim Sum", "Pho", "Ceviche", "Poke", "Mapa Tofu"]
        async(interval: 5000, intervalMax: 5) {
            self.placeholder = "\(placeholders[i])..."
            i += 1
        }
    }
    
    var hasSearch: Bool {
        store.state.home.viewStates.count > 1
    }
    
    private var homeSearch: Binding<String> {
        store.binding(for: \.home.viewStates.last!.search, { .home(.setSearch($0)) })
    }
    
    private var homeTags: Binding<[SearchInputTag]> {
        Binding<[SearchInputTag]>(
            get: { Selectors.home.tags() },
            set: { self.store.send(.home(.setCurrentTags($0))) }
        )
    }
    
    func focusKeyboard() {
        log.info()
        self.isFirstResponder = false
        DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(2)) {
            self.isFirstResponder = true
        }
    }
    
    @State var lastZoomed = false
    
    var icon: AnyView {
        if store.state.home.viewStates.count > 1 {
            return AnyView(
                Image(systemName: "chevron.left").onTapGesture {
                    self.keyboard.hide()
                    self.store.send(.home(.pop))
                }
            )
        } else {
            return AnyView(
                Image(systemName: "magnifyingglass")
            )
        }
    }
    
    let after = AnyView(HomeSearchBarAfterView(scale: 1.2))
    
    func onClear() {
        // go back on empty search clear
        if Selectors.home.isOnSearchResults() && App.store.state.home.viewStates.last!.searchResults.results.count == 0 {
            App.store.send(.home(.pop))
        }
        // focus keyboard again on clear if not focused
        if self.keyboard.state.height == 0 {
            self.focusKeyboard()
        }
    }
    
    var body: some View {
        let zoomed = keyboard.state.height > 0
        let scale: CGFloat = zoomed ? 1.2 : 1.2
        
        return Group {
            RunOnce(name: "updatePlaceholder") {
                self.updatePlaceholder()
            }
            Run("updateLastZoomed") {
                if self.lastZoomed != zoomed {
                    self.lastZoomed = zoomed
                }
            }
            
            SearchInput(
                placeholder: self.placeholder,
                inputBackgroundColor: Color.white,
                borderColor: Color.white,
                scale: scale,
                sizeRadius: 2.0,
                icon: icon,
                showCancelInside: true,
                onClear: self.onClear,
                after: after,
                isFirstResponder: isFirstResponder,
                searchText: self.homeSearch,
                tags: self.homeTags,
                showInput: showInput
            )
                .shadow(color: Color.black.opacity(0.35), radius: 8, x: 0, y: 3)
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
                        }
                    }
                }
                .frame(width: 14 * scale, height: 14 * scale)
                .opacity(0.5)
            }
            .padding(.vertical, 4 * scale)
            .padding(.horizontal, 6 * scale)
            
            // space for the camera button
            CustomButton2(action: {
                
            }) {
                ZStack {
                    Group {
                        Image(systemName: "arrowtriangle.up.circle.fill")
                            .resizable()
                            .scaledToFit()
                            .foregroundColor(Color("color-brand").opacity(0.5))
                    }
                    .foregroundColor(oppositeColor.opacity(0.5))
                }
                .padding(.all, 40 * 0.33)
                .frame(width: 40, height: 40)
                .cornerRadius(40)
                .overlay(
                    RoundedRectangle(cornerRadius: 40)
                        .stroke(oppositeColor.opacity(0.1), lineWidth: 1)
                )
            }
            .frame(width: 40)
        }
    }
}

struct CameraButton: View {
    var foregroundColor: Color = .black
    
    @State var isTapped = false
    @State var lastTap = Date()
    
    @Environment(\.colorScheme) var colorScheme
    
    var body: some View {
        let oppositeColor = colorScheme == .dark ? Color.white : Color.black
        
        return CustomButton2(action: {
            self.lastTap = Date()
            if !App.store.state.home.showCamera {
                App.store.send(.home(.setShowCamera(true)))
            } else {
                App.store.send(.camera(.capture(true)))
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
