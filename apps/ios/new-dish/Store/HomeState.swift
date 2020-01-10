import SwiftUI
import Combine
import GoogleMaps

extension AppState {
    struct HomeState: Equatable {
        var view: HomePageView = .home
        var state: [HomeStateItem] = [HomeStateItem()]
        var showDrawer: Bool = false
    }
}

enum HomeAction {
    case setView(_ page: HomePageView)
    case setShowDrawer(_ val: Bool)
    case push(_ state: HomeStateItem)
    case pop
    case toggleDrawer
    case setSearch(_ val: String)
    case setSearchResults(_ val: HomeSearchResults)
    case setCurrentTags(_ val: [SearchInputTag])
}

var lastSearch = AnyCancellable {}

func homeReducer(_ state: inout AppState, action: HomeAction) {
    
    // use this to ensure you update HomeStateItems correctly
    func updateItem(_ next: HomeStateItem) {
        if let index = state.home.state.firstIndex(where: { $0.id == next.id }) {
            var item = next
            item.id = uid()
            state.home.state[index] = item
        }
    }
    
    switch action {
        case let .setSearchResults(val):
            var last = state.home.state.last!
            last.searchResults = val
            updateItem(last)
        case let .setCurrentTags(val):
            var last = state.home.state.last!
            last.filters = val.map { SearchFilter(name: $0.text) }
            updateItem(last)
            if let search = val.last?.text {
                appStore.send(.home(.setSearch(search)))
            }
        case let .setSearch(val):
            var last = state.home.state.last!
            
            // TODO if filter/category exists (like Pho), move it to tags not search
            
            // push into search results
            if last.search == "" {
                state.home.state.append(
                    HomeStateItem(search: val)
                )
            } else {
                last.search = val
                updateItem(last)
            }

            lastSearch.cancel()
            var cancelled = false
            lastSearch = AnyCancellable { cancelled = true }
            DispatchQueue.main.async {
                if !cancelled {
                    // SEARCH
                    googlePlaces.searchPlaces(val, completion: { places in
                        print("PLACES ok got \(places.count)")
                        DispatchQueue.main.async {
                            appStore.send(.home(.setSearchResults(
                                HomeSearchResults(
                                    id: "0",
                                    results: places.map { place in
                                        HomeSearchResultItem(
                                            id: place.name,
                                            name: place.name, //place.attributedPrimaryText,
                                            place: place
                                        )
                                    }
                                )
                            )))
                        }
                    })
                }
            }

        case let .setView(page):
            state.home.view = page
        case let .setShowDrawer(val):
            state.home.showDrawer = val
        case .toggleDrawer:
            state.home.showDrawer = !state.home.showDrawer
        case let .push(homeState):
            state.home.state.append(homeState)
        case .pop:
            state.home.state = state.home.state.dropLast()
    }
}

struct HomeSelectors {
    func isOnSearchResults(_ state: AppState = appStore.state) -> Bool {
        return state.home.state.count > 1
    }
    
    func tags(_ state: AppState = appStore.state) -> [SearchInputTag] {
        let homeState = state.home.state.last!
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

struct HomeSearchResultItem: Identifiable {
    var id: String
    var name: String
    var place: GooglePlaceItem
}

struct HomeSearchResults: Equatable {
    static func == (lhs: HomeSearchResults, rhs: HomeSearchResults) -> Bool {
        lhs.id == rhs.id
    }
    
    var id: String
    enum FetchStatus { case idle, fetching, failed, completed }
    var status: FetchStatus = .idle
    var results: [HomeSearchResultItem] = []
}

func uid() -> String {
    "\(Int.random(in: 1..<100000000))"
}

struct HomeStateItem: Identifiable, Equatable {
    var id = uid()
    var search = ""
    var filters: [SearchFilter] = []
    var searchResults: HomeSearchResults = HomeSearchResults(id: "0")
}

struct SearchFilter: Equatable {
    enum SearchFilterType { case cuisine }
    var type: SearchFilterType = .cuisine
    var name = ""
}
