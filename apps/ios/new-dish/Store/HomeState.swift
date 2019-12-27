extension AppState {
    struct HomeState: Equatable {
        var view: HomePageView = .home
        var current: [HomeStateItem] = [HomeStateItem()]
        var showDrawer: Bool = false
    }
}

enum HomeAction {
    case changeHomePage(_ page: HomePageView)
    case setShowDrawer(_ val: Bool)
    case push(_ state: HomeStateItem)
    case pop
    case toggleDrawer
}

func homeReducer(_ state: inout AppState, action: HomeAction) {
    switch action {
        case let .changeHomePage(page):
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

extension AppSelect {
    static func isOnSearchResults(_ state: AppState) -> Bool {
        state.home.current.last!.dish != ""
    }
}

// structures for HomeStore


enum HomePageView {
    case home, camera
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
