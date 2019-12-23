import SwiftUI

struct HomeSearchBar: View {
    @State var searchText = ""
    @State var scrollAtTop = true
    @EnvironmentObject var homeState: HomeViewState
    
    var body: some View {
        ZStack {
            SearchInput(
                placeholder: "Pho, Burger, Wings...",
                inputBackgroundColor: Color.white,
                borderColor: Color.gray.opacity(0.14),
                scale: self.scrollAtTop ? 1.25 : 1.0,
                sizeRadius: 2.0,
                icon: AnyView(
                    Image(systemName: "chevron.left").onTapGesture {
                        print("back")
                    }
                ),
                showCancelInside: true,
                after: AnyView(
                    Image(systemName: "arrow.up.and.down.circle.fill")
                        .resizable()
                        .frame(width: 26, height: 26)
                        .padding(4)
                        .opacity(0.45)
                        .onTapGesture {
                            self.homeState.toggleMap()
                            
                    }
                ),
                searchText: self.$searchText,
                pinnedText: "Pho"
            )
        }
    }
}

