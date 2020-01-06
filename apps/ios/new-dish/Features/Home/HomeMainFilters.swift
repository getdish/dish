import SwiftUI

struct HomeMainFilters: View {
    @EnvironmentObject var store: AppStore
    @State var showTypeMenu = false

    var body: some View {
        ZStack {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack {
                    Spacer().frame(width: 48)
                    FilterButton(label: "American", action: {
                        // todo move this into action
                        let curState = self.store.state.home.current.last!
                        let filters = curState.filters.filter({ $0.type == .cuisine }) + [
                            SearchFilter(type: .cuisine, name: "American")
                        ]
                        self.store.send(.home(.push(HomeStateItem(
                            search: curState.search,
                            filters: filters
                        ))))
                    })
                    FilterButton(label: "Thai", action: {})
                    FilterButton(label: "Chinese", action: {})
                    FilterButton(label: "Italian", action: {})
                    FilterButton(label: "French", action: {})
                    FilterButton(label: "Burmese", action: {})
                    FilterButton(label: "Greek", action: {})
                }
                .padding(.horizontal)
            }
            
            HStack {
                ContextMenuView(menuContent: {
                    List {
                        Text("Item One")
                        Text("Item Two")
                        Text("Item Three")
                    }
                        .frame(height: 150) // todo how to get lists that shrink
                }) {
                    Image(systemName: "line.horizontal.3.decrease.circle")
                        .foregroundColor(Color.white.opacity(0.5))
                        .font(.system(size: 26))
                        .padding(.horizontal, 6)
                        .onTapGesture {
                            self.showTypeMenu = true
                    }
                }
                Spacer()
            }
            .padding(.horizontal)
        }
    }
}
