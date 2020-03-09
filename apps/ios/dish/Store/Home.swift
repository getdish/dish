import Combine
import MapKit
import SwiftUI

struct FetchedResults<Item>: Equatable where Item: Equatable {
  enum FetchStatus { case idle, fetching, failed, completed }
  var id = uid()
  var status: FetchStatus = .fetching
  var results: [Item] = []
}

typealias SearchResultRestaurant = FetchedResults<RestaurantItem>

struct HomeStateItem: Identifiable, Equatable {
  enum State: Equatable {
    case home
    case search(search: String, results: SearchResultRestaurant = FetchedResults())
    case selection(items: [RestaurantItem])
    case restaurantDetail(restaurant: RestaurantItem)
  }
  
  var id = uid()
  var state: State = .home
  
  // computed value helpers
  
  var queryString: String {
    if case .search(let query, _) = state {
      return query
    }
    return ""
  }
  
  var isLoading: Bool {
    if case .search(_, let results) = state {
      return results.status == .fetching
    }
    return false
  }
  
  var restaurant: RestaurantItem? {
    if case .restaurantDetail(let val) = state {
      return val
    }
    return nil
  }
  
  var searchResults: SearchResultRestaurant? {
    if case .search(_, let val) = state {
      return val
    }
    return nil
  }
}

struct LenseItem: Equatable, Identifiable {
  var id: String = "\(uid())"
  var name: String
  var icon: String = ""
  var rgb: [Double] = [0.65, 0.2, 0.65]
  var description: String? = nil
  
  var color: Color {
    Color(red: self.rgb[0], green: self.rgb[1], blue: self.rgb[2])
  }
  
  var colorBright: Color {
    let (r, g, b) = (rgb[0], rgb[1], rgb[2])
    var c0 = RGB(r: r, g: g, b: b).hsv
    c0.s = 1.0
    let c1 = c0.rgb
    return Color(
      red: c1.r,
      green: c1.g,
      blue: c1.b
    )
  }
}

struct CuisineItem: Equatable, Identifiable {
  let id: String
  let name: String
  let icon: String
}

fileprivate let initialLenses: [LenseItem] = [
//  LenseItem(id: "1", name: "Me", icon: "", rgb: [0.2, 0.65, 0.65], description: "My top"),
  LenseItem(id: "0", name: "", icon: "⭐️", rgb: [0.8, 0.1, 0.1], description: "Most popular"),
  LenseItem(id: "2", name: "New", icon: "🔥", rgb: [0.5, 0.1, 0.1], description: "New"),
  LenseItem(id: "3", name: "Picks", icon: "👩‍🍳", rgb: [0.6, 0.1, 0.5], description: "Chef choice"),
  LenseItem(id: "4", name: "Date 🌃", icon: "", rgb: [0.35, 0.2, 0.65], description: "Date night"),
  LenseItem(id: "6", name: "", icon: "Planty 🥬", rgb: [0.2, 0.7, 0.2], description: "Plant based"),
  LenseItem(id: "7", name: "", icon: "Fresh 🐟", rgb: [0.65, 0.2, 0.65], description: "Seafood"),
  LenseItem(id: "8", name: "Cheap", icon: "💸", rgb: [0.65, 0.2, 0.65], description: "Cheap"),
]

fileprivate let initialFilters: [FilterItem] = [
  //  FilterItem(name: "★", fontSize: 18, groupId: "rating"),
  //  FilterItem(name: "★★", fontSize: 15, groupId: "rating", stack: true),
  //  FilterItem(name: "★★★", fontSize: 13, groupId: "rating", stack: true),
  FilterItem(name: "$", fontSize: 18, groupId: "price", stack: true),
  FilterItem(name: "$$", fontSize: 15, groupId: "price", stack: true),
  FilterItem(name: "$$$", fontSize: 13, groupId: "price", stack: true),
  FilterItem(name: "🚗", fontSize: 15, groupId: "delivery"),
  FilterItem(name: "Open", fontSize: 15, groupId: "normal"),
  FilterItem(name: "Healthy", fontSize: 15, groupId: "normal"),
  FilterItem(name: "Cash Only", fontSize: 15, groupId: "normal"),
  FilterItem(name: "Diet", fontSize: 15, groupId: "diet", stack: true),
  FilterItem(name: "Vegan", fontSize: 15, groupId: "diet", stack: true),
  FilterItem(name: "Veggie", fontSize: 15, groupId: "diet", stack: true),
  FilterItem(name: "Pescatarian", fontSize: 15, groupId: "diet", stack: true),
  FilterItem(name: "Gluten-free", fontSize: 15, groupId: "diet", stack: true),
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
  CuisineItem(id: "8", name: "Vietnamese", icon: "🇻🇳"),
]

struct HomeFocusedItem: Equatable {
  var restaurant: RestaurantItem
  var rank: Int
  var targetMinY: CGFloat
}

enum HomeTopLevelFilter {
  case dish, restaurant
}

extension AppState {
  typealias SearchFocus = SearchFocusState
  
  struct HomeState: Equatable {
    var viewStates: [HomeStateItem] = [HomeStateItem()]
    var focusedItem: HomeFocusedItem? = nil
    var filters: [FilterItem] = initialFilters
    var filterTopLevel: HomeTopLevelFilter = .dish
    var cuisines: [CuisineItem] = initialCuisines
    var lenses: [LenseItem] = initialLenses
    var lenseActive = 0
    var lenseToDishes = [String: [DishItem]]()
    var searchFocus: SearchFocusState = .off
    var drawerPosition: BottomDrawerPosition = .middle
    var drawerIsDragging = false
    var showCuisineFilter: Bool = false
    var cuisineFilter: String = "Cuisine"
    var showFilters = false
  }
}

enum HomeAction {
  case navigateToDishResults(_ val: DishItem)
  case navigateToRestaurant(_ val: RestaurantItem)
  case push(_ val: HomeStateItem)
  case pop
  case setSearch(_ val: String)
  case setSearchResults(_ val: SearchResultRestaurant)
  case setLenseActive(_ val: Int)
  case setLenseToDishes(id: String, dishes: [DishItem])
  case setSearchFocus(_ val: SearchFocusState)
  case setFilterActive(filter: FilterItem, val: Bool)
  case setDrawerPosition(_ position: BottomDrawerPosition)
  case clearSearch
  case toggleShowCuisineFilter
  case setCuisineFilter(_ cuisine: String)
  case setDrawerIsDragging(_ val: Bool)
  case setSelectedMarkers(_ val: [MapMarker])
  case setFocusedItem(_ dish: HomeFocusedItem?)
  case toggleShowFilters
}

func homeReducer(_ state: inout AppState, action: HomeAction) {
  
  // utils
  
  // use this to ensure you update HomeStateItems correctly
  func updateItem(_ next: HomeStateItem) {
    if let index = state.home.viewStates.firstIndex(where: { $0.id == next.id }) {
      var insert = next
      insert.id = UUID().uuidString
      state.home.viewStates[index] = insert
    }
  }
  
  // switch
  
  switch action {
    case .navigateToDishResults(let dish):
      let next = HomeStateItem(
        state: .search(
          search: dish.name,
          // TODO this will pre-populate with results we prefetch on explore/home
          results: .init(status: .completed, results: [restaurants[0]])
        )
      )
      state.home.viewStates.append(next)
    case .toggleShowFilters:
      state.home.showFilters = !state.home.showFilters
    case .setFocusedItem(let dish):
      if state.home.drawerIsDragging == false {
        state.home.focusedItem = dish
      }
    case .setSelectedMarkers(let markers):
      let last = state.home.viewStates.last!
      if case .search(_, let results) = last.state {
        state.home.viewStates.append(
          HomeStateItem(
            id: "lense-\(markers)",
            state: .selection(
              items: markers.compactMap { marker in
                results.results.first { $0.name == marker.title }
              }
            )
          )
        )
    }
    case .setDrawerIsDragging(let val):
      if val != state.home.drawerIsDragging {
        state.home.drawerIsDragging = val
      }
    case .setCuisineFilter(let cuisine):
      state.home.cuisineFilter = cuisine
    case .toggleShowCuisineFilter:
      state.home.showCuisineFilter = !state.home.showCuisineFilter
    case .setDrawerPosition(let position):
      if position != state.home.drawerPosition {
        state.home.drawerPosition = position
      }
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
    case let .navigateToRestaurant(restaurant):
      state.home.viewStates.append(
        HomeStateItem(state: .restaurantDetail(restaurant: restaurant))
    )
    case let .setSearchResults(val):
      var last = state.home.viewStates.last!
      if case .search(let search, _) = last.state {
        last.state = .search(search: search, results: val)
        updateItem(last)
    }
    case let .setSearch(val):
      var last = state.home.viewStates.last!
      // push into search results
      if case .search(_, var results) = last.state {
        results.results = []
        results.status = .fetching
        last.state = .search(search: val, results: results)
        updateItem(last)
      } else {
        state.home.viewStates.append(
          HomeStateItem(state: .search(search: val))
        )
    }
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
    lastState(store).restaurant
  }
  
  func lastState(_ store: AppStore = App.store) -> HomeStateItem {
    store.state.home.viewStates.last!
  }
  
  func latestResults(_ store: AppStore = App.store) -> SearchResultRestaurant? {
    let last = self.lastState(store)
    if case .search(_, results: let results) = last.state {
      return results
    }
    return nil
  }
  
  func latestResultsItems(_ store: AppStore = App.store) -> [RestaurantItem] {
    if let searchResults = self.latestResults(store) {
      return searchResults.results
    }
    return []
  }
  
  func latestSearch(_ store: AppStore = App.store) -> String {
    let last = self.lastState(store)
    if case .search(let query, _) = last.state {
      return query
    }
    return ""
  }
  
  func activeLense(_ store: AppStore = App.store) -> LenseItem {
    store.state.home.lenses[store.state.home.lenseActive]
  }
  
  func drawerRGB(_ store: AppStore = App.store, colorScheme: ColorScheme) -> [Double] {
    let c = activeLense(store).rgb
    return colorScheme == .dark
      ? [c[0] * 0.5, c[1] * 0.5, c[2] * 0.5]
      : [1, 1, 1]
  }
  
  func drawerColor(_ store: AppStore = App.store, colorScheme: ColorScheme) -> Color {
    let d = drawerRGB(store, colorScheme: colorScheme)
    return Color(red: d[0], green: d[1], blue: d[2])
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

enum HomePageView {
  case home, camera, me
}

func uid() -> String {
  "\(Int.random(in: 1..<100_000_000))"
}
