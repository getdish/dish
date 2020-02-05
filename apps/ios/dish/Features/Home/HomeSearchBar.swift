import SwiftUI

// this can be expanded to handle types of filters
struct SearchToTagColor {
    static let dish = Color(red: 0.2, green: 0.4, blue: 0.7, opacity: 0.5)
    static let filter = Color(red: 0.6, green: 0.2, blue: 0.4, opacity: 0.5)
}

struct HomeSearchBar: View {
    @State var searchText = ""
    @State var textField: UITextField? = nil
    @State var isFirstResponder = false
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var keyboard: Keyboard
    @Environment(\.colorScheme) var colorScheme
    
    @State var placeholder = "The best dim sum..."
    
    func updatePlaceholder() {
        var i = 0
        let placeholders = ["dim sum", "bo kho", "ceviche", "poke", "mapa tofu"]
        async(interval: 5000, intervalMax: 5) {
            self.placeholder = "The best \(placeholders[i])..."
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
    
    var body: some View {
        let zoomed = keyboard.state.height > 0
        let scale: CGFloat = zoomed ? 1.5 : 1.3
        
        return Group {
            RunOnce {
                self.updatePlaceholder()
            }
            Run {
                self.lastZoomed = zoomed
            }
            
            SearchInput(
                placeholder: self.placeholder,
                inputBackgroundColor: colorScheme == .dark
                    ? Color(red: 0.25, green: 0.25, blue: 0.25)
                    : Color.white,
                borderColor: Color.clear,
                scale: scale,
                sizeRadius: 2.0,
                icon: icon,
                showCancelInside: true,
                onClear: {
                    // go back on empty search clear
                    if Selectors.home.isOnSearchResults() && App.store.state.home.viewStates.last!.searchResults.results.count == 0 {
                        App.store.send(.home(.pop))
                    }
                    // focus keyboard again on clear if not focused
                    if self.keyboard.state.height == 0 {
                        self.focusKeyboard()
                    }
            },
                after: AnyView(HomeSearchBarAfterView(scale: scale)),
                isFirstResponder: isFirstResponder,
                //            onTextField: { field in
                //                print("set text field")
                //                self.textField = field
                //            },
                searchText: self.homeSearch,
                tags: self.homeTags
            )
            .animation(.spring(), value: zoomed != self.lastZoomed)
        }
    }
    
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
}

struct HomeSearchBarAfterView: View {
    var scale: CGFloat
    
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var homeState: HomeViewState
    
    var body: some View {
        HStack {
            Button(action: {
                self.homeState.toggleMap()
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
            Spacer()
                .frame(width: App.cameraButtonHeight)
        }
    }
}
