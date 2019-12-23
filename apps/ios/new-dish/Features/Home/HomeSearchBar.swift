import SwiftUI

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
            pinnedText: self.store.state.homeState.last!.search
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
            Image(systemName: "arrow.up.and.down.circle.fill")
                .resizable()
                .frame(width: 26, height: 26)
                .padding(4)
                .opacity(0.45)
                .onTapGesture {
                    self.homeState.toggleMap()
                    
            }
        )
    }
}

