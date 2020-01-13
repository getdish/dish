import SwiftUI

struct HomeMainFilters: View {
    var body: some View {
        ZStack {
            ScrollView(.horizontal, showsIndicators: false) {
                HomeMainFiltersContent()
            }
            
            // cover right part of filters so its untouchable and doesnt conflict with side drags
            HStack {
                Spacer()
                Color.black.opacity(0.0001).frame(width: 35, height: 55)
            }
        }
    }
}

struct HomeMainFiltersContent: View {
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        HStack {
            FilterButton(label: "American", action: {
                // todo move this into action
                let curState = self.store.state.home.state.last!
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
        .padding()
    }
}

//                    ContextMenuView(menuContent: {
//                        List {
//                            Text("Item One")
//                            Text("Item Two")
//                            Text("Item Three")
//                        }
//                            .frame(height: 150) // todo how to get lists that shrink
//                    }) {
//                        Text("🍽")// "line.horizontal.3.decrease.circle")
//                            .foregroundColor(Color.white.opacity(0.5))
//                            .font(.system(size: 26))
//                            .onTapGesture {
//                                self.showTypeMenu = true
//                        }
//                    }
