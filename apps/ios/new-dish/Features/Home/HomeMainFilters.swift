import SwiftUI

struct HomeMainFilters: View {
    enum Filters { case cuisine, search }
    
    @EnvironmentObject var store: AppStore
    @State var showFilters: Filters = .cuisine
    @State var wasOnSearchResults = false
    
    var body: some View {
        let leftPad = Spacer().frame(width: 50)
        
        return ZStack {
            Run {
                // side effect => search filters change
                if !self.wasOnSearchResults && Selectors.home.isOnSearchResults() {
                    self.wasOnSearchResults = true
                    self.showFilters = .search
                }
            }
            
            ZStack(alignment: .leading) {
                Group {
                    if showFilters == .search {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack {
                                leftPad
                                HomeSearchResultsFilters()
                            }
                            .padding()
                            .environment(\.colorScheme, .dark)
                        }
                        
                    }
                    else {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack {
                                leftPad
                                HomeMainFiltersContent()
                            }
                            .padding()
                            .environment(\.colorScheme, .light)
                        }
                    }
                    
                    CustomButton({
                        self.showFilters = self.showFilters == .cuisine ? .search : .cuisine
                    }) {
                        Text(self.showFilters == .cuisine ? "🍽" : "🔍")
                            .font(.system(size: 28))
//                            .frame(width: 24, height: 24)
                    }
//                    .cornerRadius(200)
//                    .clipped()
                    .offset(x: 20)
                }
                .animation(.spring(response: 0.25))
                .transition(.slide)
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
        Group {
            FilterButton(label: "Hole in the Wall", action: {})
            FilterButton(label: "Date Spot", action: {})
            FilterButton(label: "Healthy", action: {})
            FilterButton(label: "Quiet", action: {})
            FilterButton(label: "Locals Favorite", action: {})
        }
    }
}

struct HomeMainFiltersContent: View {
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        Group {
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
    }
}
