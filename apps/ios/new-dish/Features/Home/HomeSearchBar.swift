import SwiftUI

// this can be expanded to handle types of filters
struct SearchToTagColor {
    static let dish = Color(red: 0.2, green: 0.4, blue: 0.7, opacity: 0.5)
    static let filter = Color(red: 0.6, green: 0.2, blue: 0.4, opacity: 0.5)
}

struct HomeSearchBar: View {
    @State var searchText = ""
    @State var scrollAtTop = true
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
    
    var body: some View {
        print("SearchInput tags \(Selectors.home.tags())")
        return SearchInput(
            placeholder: "Pho, Burger, Wings...",
            inputBackgroundColor: Color.white,
            borderColor: Color.gray.opacity(0.14),
            scale: self.scrollAtTop ? 1.25 : 1.0,
            sizeRadius: 2.0,
            icon: icon,
            showCancelInside: true,
            after: AnyView(HomeSearchBarAfterView()),
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
        Button(action: {
            self.homeState.toggleMap()
        }) {
            Image(systemName: self.homeState.isSnappedToTop ?
                "chevron.down" :
                self.homeState.isSnappedToBottom
                ? "chevron.up"
                : "chevron.up.chevron.down"
            )
                .resizable()
                .scaledToFit()
                .frame(width: 16, height: 16)
                .opacity(0.45)
        }
        .padding(.vertical, 4)
        .padding(.horizontal, 20)
    }
}
