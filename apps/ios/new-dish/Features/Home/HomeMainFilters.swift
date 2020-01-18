import SwiftUI

struct HomeMainFilters: View {
    enum Filters { case cuisine, search }
    
    @EnvironmentObject var store: AppStore
    @State var showFilters: Filters = .cuisine
    @State var wasOnSearchResults = false
    
    var body: some View {
        let leftPad = Spacer().frame(width: 50)
        
        return ZStack {
            SideEffect("HomeMainFilters") {
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

fileprivate let filterAction = {
    // todo move this into action
    let curState = App.store.state.home.state.last!
    let filters = curState.filters.filter({ $0.type == .cuisine }) + [
        SearchFilter(type: .cuisine, name: "American")
    ]
    App.store.send(.home(.push(HomeStateItem(
        search: curState.search,
        filters: filters
    ))))
}

struct HomeSearchResultsFilters: View {
    var body: some View {
        Group {
            FilterButton(label: "Hole in the Wall", action: filterAction)
            FilterButton(label: "Date Spot", action: filterAction)
            FilterButton(label: "Healthy", action: filterAction)
            FilterButton(label: "Quiet", action: filterAction)
            FilterButton(label: "Locals Favorite", action: filterAction)
        }
    }
}

struct HomeMainFiltersContent: View {
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        Group {
            FilterButton(label: "American", action: filterAction)
            FilterButton(label: "Thai", action: filterAction)
            FilterButton(label: "Chinese", action: filterAction)
            FilterButton(label: "Italian", action: filterAction)
            FilterButton(label: "French", action: filterAction)
            FilterButton(label: "Burmese", action: filterAction)
            FilterButton(label: "Greek", action: filterAction)
        }
    }
}
