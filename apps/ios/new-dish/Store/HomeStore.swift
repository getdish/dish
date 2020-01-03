extension AppState {
    struct HomeState: Equatable {
        var view: HomePageView = .home
        var current: [HomeStateItem] = [HomeStateItem()]
        var showDrawer: Bool = false
        var search: String = ""
    }
}

enum HomeAction {
    case setView(_ page: HomePageView)
    case setShowDrawer(_ val: Bool)
    case push(_ state: HomeStateItem)
    case pop
    case toggleDrawer
    case setSearch(_ val: String)
}

func homeReducer(_ state: inout AppState, action: HomeAction) {
    switch action {
        case let .setSearch(val):
            state.home.search = val
        case let .setView(page):
            state.home.view = page
        case let .setShowDrawer(val):
            state.home.showDrawer = val
        case .toggleDrawer:
            state.home.showDrawer = !state.home.showDrawer
        case let .push(homeState):
            state.home.current.append(homeState)
        case .pop:
            state.home.current = state.home.current.dropLast()
    }
}

struct HomeSelectors {
    func isOnSearchResults(_ state: AppState = appStore.state) -> Bool {
        state.home.current.last!.dish != ""
    }
    
    func tags(_ state: AppState = appStore.state) -> [SearchInputTag] {
        let homeState = state.home.current.last!
        var tags: [SearchInputTag] = []
        
        if homeState.dish != "" {
            tags.append(SearchInputTag(
                color: SearchToTagColor.dish,
                text: homeState.dish
            ))
        }
        
        if homeState.filters.count > 0 {
            homeState.filters.forEach { filter in
                tags.append(SearchInputTag(
                    color: SearchToTagColor.filter,
                    text: filter.name
                ))
            }
        }
        
        return tags
    }
}

// structures for HomeStore


enum HomePageView {
    case home, camera, me
}

struct HomeStateItem: Equatable {
    var search = ""
    var dish = ""
    var filters: [SearchFilter] = []
}

struct SearchFilter: Equatable {
    enum SearchFilterType { case cuisine }
    var type: SearchFilterType = .cuisine
    var name = ""
}
