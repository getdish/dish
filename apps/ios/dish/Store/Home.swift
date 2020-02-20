import SwiftUI
import Combine
import MapKit

struct LenseItem: Equatable, Identifiable {
    let id: String
    let name: String
    let icon: String
}

struct CuisineItem: Equatable, Identifiable {
    let id: String
    let name: String
    let icon: String
}

fileprivate let initialLenses = [
    LenseItem(id: "0", name: "", icon: "🏆"),
    LenseItem(id: "1", name: "Locals", icon: "👌"),
    LenseItem(id: "2", name: "New", icon: "🔥"),
    LenseItem(id: "3", name: "Picks", icon: "👩‍🍳"),
    LenseItem(id: "4", name: "Date Night", icon: "💎"),
    LenseItem(id: "5", name: "Great Service", icon: "💁‍♀️"),
    LenseItem(id: "6", name: "", icon: "🥬"),
    LenseItem(id: "7", name: "", icon: "🐟"),
    LenseItem(id: "8", name: "Cheap", icon: "💸"),
    LenseItem(id: "9", name: "Fast", icon: "🕒")
]

fileprivate let initialFilters: [FilterItem] = [
    FilterItem(name: "★", fontSize: 18, groupId: "rating", stack: true),
    FilterItem(name: "★★", fontSize: 16, groupId: "rating", stack: true),
    FilterItem(name: "★★★", fontSize: 14, groupId: "rating", stack: true),
    FilterItem(name: "$", fontSize: 20, groupId: "price", stack: true),
    FilterItem(name: "$$", fontSize: 18, groupId: "price", stack: true),
    FilterItem(name: "$$$", fontSize: 14, groupId: "price", stack: true),
    FilterItem(name: "🚗", fontSize: 15, groupId: "quick"),
    FilterItem(name: "Open", fontSize: 15, groupId: "normal"),
    FilterItem(name: "Healthy", fontSize: 15, groupId: "normal"),
    FilterItem(name: "Cash Only", fontSize: 15, groupId: "normal")
]

fileprivate let initialCuisines = [
    CuisineItem(id: "0", name: "American", icon: "🇺🇸"),
    CuisineItem(id: "1", name: "Brazilian", icon: "🇧🇷"),
    CuisineItem(id: "2", name: "Chinese", icon: "🇨🇳"),
    CuisineItem(id: "3", name: "Greek", icon: "🇬🇷"),
    CuisineItem(id: "4", name: "Indian", icon: "🇮🇳"),
    CuisineItem(id: "5", name: "Italian", icon: "🇮🇹"),
    CuisineItem(id: "6", name: "Japanese", icon: "🇯🇵"),
    CuisineItem(id: "7", name: "Thai", icon: "🇹🇭"),
    CuisineItem(id: "8", name: "Vietnamese", icon: "🇻🇳")
]

extension AppState {
    typealias SearchFocus = SearchFocusState
    
    struct HomeState: Equatable {
        var view: HomePageView = .home
        var viewStates: [HomeStateItem] = [HomeStateItem()]
        var filters: [FilterItem] = initialFilters
        var cuisines: [CuisineItem] = initialCuisines
        var lenses: [LenseItem] = initialLenses
        var lenseActive = 0
        var lenseToDishes = [String: [DishItem]]()
        var searchFocus: SearchFocusState = .off
        var drawerPosition: BottomDrawerPosition = .bottom
        var showCamera: Bool = false
    }
}

enum HomeAction {
    case setView(_ page: HomePageView)
    case navigateToRestaurant(_ val: RestaurantItem)
    case push(_ val: HomeStateItem)
    case pop
    case setSearch(_ val: String)
    case setSearchResults(_ val: HomeSearchResults)
    case setLenseActive(_ val: Int)
    case setLenseToDishes(id: String, dishes: [DishItem])
    case setSearchFocus(_ val: SearchFocusState)
    case setFilterActive(filter: FilterItem, val: Bool)
    case setDrawerPosition(_ position: BottomDrawerPosition)
    case clearSearch
}

func homeReducer(_ state: inout AppState, action: HomeAction) {
    
    // utils

    // use this to ensure you update HomeStateItems correctly
    func updateItem(_ next: HomeStateItem) {
        if let index = state.home.viewStates.firstIndex(where: { $0.id == next.id }) {
            var item = next
            item.id = uid()
            state.home.viewStates[index] = item
        }
    }
    
    // switch
    
    switch action {
        case .setDrawerPosition(let position):
            state.home.drawerPosition = position
        case .clearSearch:
            state.home.viewStates = [state.home.viewStates[0]]
        case .setSearchFocus(let val):
            state.home.searchFocus = val
        case .setFilterActive(let target, let val):
            state.home.filters = state.home.filters.map { filter in
                if filter == target {
                    var next = filter
                    next.active = val
                    return next
                }
                return filter
            }
        case .setLenseToDishes(let id, let dishes):
            state.home.lenseToDishes[id] = dishes
        case let .setLenseActive(index):
            state.home.lenseActive = index
        case let .navigateToRestaurant(resaurant):
            var homeState = state.home.viewStates.last!
            homeState.restaurant = resaurant
            state.home.viewStates.append(homeState)
        case let .setSearchResults(val):
            var last = state.home.viewStates.last!
            last.searchResults = val
            updateItem(last)
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
}

// structures for HomeStore

enum SearchFocusState {
    case off, search, location
}

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
    var stack: Bool = false
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
