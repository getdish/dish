import SwiftUI

// this can be expanded to handle types of filters
struct SearchToTagColor {
    static let dish = Color(red: 0.2, green: 0.4, blue: 0.7, opacity: 0.5)
    static let filter = Color(red: 0.6, green: 0.2, blue: 0.4, opacity: 0.5)
}

func homeStateToTags(_ state: HomeState) -> [SearchInputTag] {
    var tags: [SearchInputTag] = []
    
    if state.dish != "" {
        tags.append(SearchInputTag(
            color: SearchToTagColor.dish,
            text: state.dish
        ))
    }
    
    if state.filters.count > 0 {
        state.filters.forEach { filter in
            tags.append(SearchInputTag(
                color: SearchToTagColor.filter,
                text: filter.name
            ))
        }
    }
    
    return tags
}

struct HomeSearchBar: View {
    @State var searchText = ""
    @State var scrollAtTop = true
    @EnvironmentObject var homeState: HomeViewState
    @EnvironmentObject var store: AppStore
    
    var hasSearch: Bool {
        store.state.homeState.count > 1
    }
    
    var body: some View {
        SearchInput(
            placeholder: "Pho, Burger, Wings...",
            inputBackgroundColor: Color.white,
            borderColor: Color.gray.opacity(0.14),
            scale: self.scrollAtTop ? 1.25 : 1.0,
            sizeRadius: 2.0,
            icon: icon,
            showCancelInside: true,
            after: after,
            searchText: self.$searchText,
            tags: homeStateToTags(self.store.state.homeState.last!)
        )
    }
    
    var icon: AnyView {
        if store.state.homeState.count > 1 {
            return AnyView(
                Image(systemName: "chevron.left").onTapGesture {
                    self.store.send(.popHomeState)
                }
            )
        } else {
            return AnyView(
                Image(systemName: "magnifyingglass")
            )
        }
    }
    
    var after: AnyView {
        AnyView(
            Button(action: {
                self.homeState.toggleMap()
            }) {
                Image(systemName: "arrow.up.and.down.circle.fill")
                    .resizable()
                    .frame(width: 26, height: 26)
                    .padding(4)
                    .opacity(0.45)
            }
        )
    }
}

