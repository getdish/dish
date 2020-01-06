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
    case setCurrentTags(_ val: [SearchInputTag])
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
        case let .setCurrentTags(val):
            var last = state.home.current.last!
            last.filters = val.map { SearchFilter(name: $0.text) }
            state.home.current = state.home.current.dropLast()
            state.home.current.append(last)
    }
}

struct HomeSelectors {
    func isOnSearchResults(_ state: AppState = appStore.state) -> Bool {
        state.home.current.last!.filters.contains { $0.type == .cuisine }
    }
    
    func tags(_ state: AppState = appStore.state) -> [SearchInputTag] {
        let homeState = state.home.current.last!
        var tags: [SearchInputTag] = []
        if homeState.filters.count > 0 {
            tags = homeState.filters.map { filter in
                SearchInputTag(
                    color: SearchToTagColor.filter,
                    text: filter.name
                )
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
    var filters: [SearchFilter] = []
}

struct SearchFilter: Equatable {
    enum SearchFilterType { case cuisine }
    var type: SearchFilterType = .cuisine
    var name = ""
}
