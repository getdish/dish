import SwiftUI
import Combine
import GoogleMaps

fileprivate let initialLabels = [
    "🏆",
    "👌 Locals",
    "🔥 New",
    "👩‍🍳 Picks",
    "💎 Date Night",
    "🥬",
    "🐟",
    "💸 Cheap",
    "🕒 Fast"
]

fileprivate let initialFilters: [FilterItem] = [
    FilterItem(name: "$", fontSize: 20, groupId: "price"),
    FilterItem(name: "$$", fontSize: 18, groupId: "price"),
    FilterItem(name: "$$$", fontSize: 14, groupId: "price"),
    FilterItem(name: "🚗", fontSize: 15, groupId: "quick"),
    FilterItem(name: "Open", fontSize: 15, groupId: "normal"),
    FilterItem(name: "Healthy", fontSize: 15, groupId: "normal"),
    FilterItem(name: "Cash Only", fontSize: 15, groupId: "normal")
]

extension AppState {
    struct HomeState: Equatable {
        var view: HomePageView = .home
        var viewStates: [HomeStateItem] = [HomeStateItem()]
        var filters: [FilterItem] = initialFilters
        var labels = initialLabels
        var labelActive = 0
        var labelDishes = [String: [DishItem]]()
        var showDrawer: Bool = false
        var showCamera: Bool = false
    }
}

enum HomeAction {
    case setView(_ page: HomePageView)
    case setShowDrawer(_ val: Bool)
    case navigateToRestaurant(_ val: RestaurantItem)
    case push(_ val: HomeStateItem)
    case pop
    case toggleDrawer
    case setSearch(_ val: String)
    case setSearchResults(_ val: HomeSearchResults)
    case setCurrentTags(_ val: [SearchInputTag])
    case setLabelActive(_ val: Int)
    case setLabelDishes(id: String, dishes: [DishItem])
    case setFilterActive(filter: FilterItem, val: Bool)
}

func homeReducer(_ state: inout AppState, action: HomeAction) {
    
    // use this to ensure you update HomeStateItems correctly
    func updateItem(_ next: HomeStateItem) {
        if let index = state.home.viewStates.firstIndex(where: { $0.id == next.id }) {
            var item = next
            item.id = uid()
            state.home.viewStates[index] = item
        }
    }
    
    switch action {
        case .setFilterActive(let target, let val):
            state.home.filters = state.home.filters.map { filter in
                if filter == target {
                    var next = filter
                    next.active = val
                    return next
                }
                return filter
            }
        case .setLabelDishes(let id, let dishes):
            state.home.labelDishes[id] = dishes
        case let .setLabelActive(index):
            state.home.labelActive = index
        case let .navigateToRestaurant(resaurant):
            var homeState = state.home.viewStates.last!
            homeState.restaurant = resaurant
            state.home.viewStates.append(homeState)
        case let .setSearchResults(val):
            var last = state.home.viewStates.last!
            last.searchResults = val
            updateItem(last)
        case let .setCurrentTags(val):
            var last = state.home.viewStates.last!
            
            // if removing last filter, pop!
            if val.count == 0 {
                // TODO this shouldn't be here I think..
                async {
                    App.store.send(.home(.pop))
                }
            } else {
                last.dishes = val.map { DishFilterItem(name: $0.text) }
                updateItem(last)
                if let search = val.last?.text {
                    async {
                        App.store.send(.home(.setSearch(search)))
                    }
                }
        }
        case let .setSearch(val):
            var last = state.home.viewStates.last!
            // TODO if filter/category exists (like Pho), move it to tags not search
            // push into search results
            if last.search == "" {
                state.home.viewStates.append(
                    HomeStateItem(search: val)
                )
            } else {
                last.search = val
                updateItem(last)
        }
        case let .setView(page):
            state.home.view = page
        case let .setShowDrawer(val):
            state.home.showDrawer = val
        case .toggleDrawer:
            state.home.showDrawer = !state.home.showDrawer
        case let .push(homeState):
            state.home.viewStates.append(homeState)
        case .pop:
            if state.home.viewStates.count > 1 {
                state.home.viewStates = state.home.viewStates.dropLast()
            }
    }
}

struct HomeSelectors {
    func isOnHome(_ store: AppStore = App.store) -> Bool {
        store.state.home.viewStates.count == 1
    }
    
    func isOnSearchResults(_ store: AppStore = App.store) -> Bool {
        store.state.home.viewStates.count > 1
    }
    
    func isOnRestaurant(_ store: AppStore = App.store) -> Bool {
        self.restaurant(store) != nil
    }
    
    func restaurant(_ store: AppStore = App.store) -> RestaurantItem? {
        store.state.home.viewStates.last!.restaurant
    }
    
    func lastState(_ store: AppStore = App.store) -> HomeStateItem {
        store.state.home.viewStates.last!
    }
    
    func tags(_ store: AppStore = App.store) -> [SearchInputTag] {
        let homeState = store.state.home.viewStates.last!
        var tags: [SearchInputTag] = []
        if homeState.dishes.count > 0 {
            tags = homeState.dishes.map { dish in
                SearchInputTag(
                    color: SearchToTagColor.filter,
                    text: dish.name,
                    deletable: dish.deletable
                )
            }
        }
        return tags
    }
}

// structures for HomeStore

struct FilterItem: Identifiable, Equatable {
    enum FilterType {
        case toggle, select
    }
    
    var id: String { name }

    var name: String
    var icon: String? = nil
    var type: FilterType = .toggle
    var active: Bool = false
    var fontSize: CGFloat = 20
    var groupId: String = ""
}

struct HomeStateItem: Identifiable, Equatable {
    var id = uid()
    var search = ""
    var dishes: [DishFilterItem] = []
    var searchResults: HomeSearchResults = HomeSearchResults(id: "0")
    var restaurant: RestaurantItem? = nil
    
    var queryString: String {
        self.search + " " + self.dishes.map { $0.name }.joined(separator: " ")
    }
}

struct DishFilterItem: Equatable {
    enum SearchFilterType {
        case root, cuisine
    }
    var type: SearchFilterType = .cuisine
    var name = ""
    var deletable = true
}

enum HomePageView {
    case home, camera, me
}

struct HomeSearchResultItem: Identifiable {
    var id: String
    var name: String
    var coordinate: CLLocationCoordinate2D
}

struct HomeSearchResults: Equatable {
    static func == (lhs: HomeSearchResults, rhs: HomeSearchResults) -> Bool {
        lhs.id == rhs.id
    }
    
    enum FetchStatus {
        case idle, fetching, failed, completed
    }
    
    var id: String
    var status: FetchStatus = .idle
    var results: [HomeSearchResultItem] = []
}

func uid() -> String {
    "\(Int.random(in: 1..<100000000))"
}
