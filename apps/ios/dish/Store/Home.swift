import SwiftUI
import Combine
import GoogleMaps

extension AppState {
    struct HomeState: Equatable {
        var view: HomePageView = .home
        var viewStates: [HomeStateItem] = [
            HomeStateItem(filters: [
                //                SearchFilter(type: .root, name: "Dish", deletable: false)
            ])
        ]
        var showDrawer: Bool = false
        var showCamera: Bool = false
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
                last.filters = val.map { SearchFilter(name: $0.text) }
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
    func isOnSearchResults(_ state: AppState = App.store.state) -> Bool {
        return state.home.viewStates.count > 1
    }
    
    func lastState(_ state: AppState = App.store.state) -> HomeStateItem {
        return state.home.viewStates.last!
    }
    
    func tags(_ state: AppState = App.store.state) -> [SearchInputTag] {
        let homeState = state.home.viewStates.last!
        var tags: [SearchInputTag] = []
        if homeState.filters.count > 0 {
            tags = homeState.filters.map { filter in
                SearchInputTag(
                    color: SearchToTagColor.filter,
                    text: filter.name,
                    deletable: filter.deletable
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
    var coordinate: Coordinate
    struct Coordinate {
        let lat: Double
        let long: Double
    }
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

struct HomeStateItem: Identifiable, Equatable {
    var id = uid()
    var search = ""
    var filters: [SearchFilter] = []
    var searchResults: HomeSearchResults = HomeSearchResults(id: "0")
    
    var queryString: String {
        self.search + " " + self.filters.map { $0.name }.joined(separator: " ")
    }
}

struct SearchFilter: Equatable {
    enum SearchFilterType {
        case root, cuisine
    }
    var type: SearchFilterType = .cuisine
    var name = ""
    var deletable = true
}
