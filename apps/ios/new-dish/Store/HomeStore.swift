import SwiftUI
import Combine
import GoogleMaps

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
    case setSearchResults(_ val: HomeSearchResults)
    case setCurrentTags(_ val: [SearchInputTag])
}

var lastSearch = AnyCancellable {}

func homeReducer(_ state: inout AppState, action: HomeAction) {
    switch action {
        case let .setSearchResults(val):
            var last = state.home.current.last!
            last.searchResults = val
            state.home.current = state.home.current.dropLast()
            state.home.current.append(last)
        case let .setSearch(val):
            state.home.search = val
            
            lastSearch.cancel()
            var cancelled = false
            lastSearch = AnyCancellable { cancelled = true }
            DispatchQueue.main.async {
                if !cancelled {
                    // SEARCH
                    googlePlaces.searchPlaces(val, completion: { places in
                        print("PLACES ok got \(places.count)")
                        appStore.send(.home(.setSearchResults(
                            HomeSearchResults(
                                id: "0",
                                results: places.map { place in
                                    HomeSearchResultItem(
                                        id: place.name,
                                        name: place.name, //place.attributedPrimaryText,
                                        coords: place.coordinate
                                    )
                                }
                            )
                        )))
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

struct HomeSearchResultItem: Identifiable {
    var id: String
    var name: String
    var coords: CLLocationCoordinate2D? = nil
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

struct HomeStateItem: Equatable {
    var search = ""
    var filters: [SearchFilter] = []
    var searchResults: HomeSearchResults = HomeSearchResults(id: "0")
}

struct SearchFilter: Equatable {
    enum SearchFilterType { case cuisine }
    var type: SearchFilterType = .cuisine
    var name = ""
}
