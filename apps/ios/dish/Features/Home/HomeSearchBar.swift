import SwiftUI

// this can be expanded to handle types of filters
struct SearchToTagColor {
    static let dish = Color(red: 0.2, green: 0.4, blue: 0.7, opacity: 0.5)
    static let filter = Color(red: 0.6, green: 0.2, blue: 0.4, opacity: 0.5)
}

struct HomeSearchBar: View {
    @State var searchText = ""
    @State var scrollAtTop = true
    @State var textField: UITextField? = nil
    @State var isFirstResponder = false
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var keyboard: Keyboard
    
    var hasSearch: Bool {
        store.state.home.state.count > 1
    }
    
    private var homeSearch: Binding<String> {
        store.binding(for: \.home.state.last!.search, { .home(.setSearch($0)) })
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
        SearchInput(
            placeholder: "",
            inputBackgroundColor: Color.white,
            borderColor: Color.gray.opacity(0.14),
            scale: self.scrollAtTop ? 1.25 : 1.05,
            sizeRadius: 2.0,
            icon: icon,
            showCancelInside: true,
            onClear: {
                // go back on empty search clear
                if Selectors.home.isOnSearchResults() && App.store.state.home.state.last!.searchResults.results.count == 0 {
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
    
    var icon: AnyView {
        if store.state.home.state.count > 1 {
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
    @EnvironmentObject var homeState: HomeViewState
    
    var body: some View {
        HStack {
            Button(action: {
                self.homeState.toggleMap()
            }) {
                Group {
                    if self.homeState.isSnappedToTop {
                        Image(systemName: "chevron.down")
                            .resizable()
                            .scaledToFit()
                            
                    }
                    else if self.homeState.isSnappedToBottom {
                        Image(systemName: "chevron.up")
                            .resizable()
                            .scaledToFit()
                    }
                    else {
                        EmptyView()
//                        Image(systemName: "chevron.down")
//                            .resizable()
//                            .scaledToFit()
                    }
                }
                .frame(width: 16, height: 16)
                .opacity(0.5)
                .padding(.trailing, 8 + App.cameraButtonHeight * 0.5)
            }
            .padding(.vertical, 4)
            .padding(.horizontal, 6)
        }
        .padding(.trailing, 4)
    }
}
