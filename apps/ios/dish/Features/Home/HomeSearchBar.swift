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
    
    @State var placeholder = "Dim Sum..."
    
    func updatePlaceholder() {
        var i = 0
        let placeholders = ["Bo Kho...", "Ceviche...", "Poke..."]
        async(interval: 5000, intervalMax: 5) {
            self.placeholder = placeholders[i]
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
    
    var body: some View {
        Group {
            SideEffect("HomeSearchBar.updatePlaceholder") { self.updatePlaceholder() }
            
            SearchInput(
                placeholder: self.placeholder,
                inputBackgroundColor: colorScheme == .dark
                    ? Color(red: 0.2, green: 0.2, blue: 0.2)
                    : Color.white,
                borderColor: Color.clear,
                scale: keyboard.state.height > 0 ? 1.5 : 1.2,
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
                after: AnyView(HomeSearchBarAfterView()),
                isFirstResponder: isFirstResponder,
                //            onTextField: { field in
                //                print("set text field")
                //                self.textField = field
                //            },
                searchText: self.homeSearch,
                tags: self.homeTags
            )
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
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var homeState: HomeViewState
    
    var body: some View {
        HStack {
            Button(action: {
                self.homeState.toggleMap()
            }) {
                Group {
//                    if self.homeState.isSnappedToTop {
//                        Image(systemName: "chevron.down")
//                            .resizable()
//                            .scaledToFit()
//
//                    } else
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
                .frame(width: 16, height: 16)
                .opacity(0.5)
                .padding(.trailing, 14 + App.cameraButtonHeight * 0.5)
            }
            .padding(.vertical, 4)
            .padding(.horizontal, 6)
        }
        .padding(.trailing, 4)
    }
}
