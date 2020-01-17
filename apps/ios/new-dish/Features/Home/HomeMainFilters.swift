import SwiftUI

struct HomeMainFilters: View {
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        ZStack {
            if Selectors.home.isOnSearchResults() {
                ScrollView(.horizontal, showsIndicators: false) {
                    HomeSearchResultsFilters()
                        .environment(\.colorScheme, .dark)
                }
            }
            else {
                ScrollView(.horizontal, showsIndicators: false) {
                    HomeMainFiltersContent()
                        .environment(\.colorScheme, .light)
                }
            }
            
            // cover right part of filters so its untouchable and doesnt conflict with side drags
            HStack {
                Spacer()
                Color.black.opacity(0.0001).frame(width: 35, height: 55)
            }
        }
    }
}

struct HomeSearchResultsFilters: View {
    var body: some View {
        HStack {
            FilterButton(label: "Hole in the Wall", action: {})
            FilterButton(label: "Date Spot", action: {})
            FilterButton(label: "Healthy", action: {})
            FilterButton(label: "Quiet", action: {})
            FilterButton(label: "Locals Favorite", action: {})
        }
        .padding()
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
