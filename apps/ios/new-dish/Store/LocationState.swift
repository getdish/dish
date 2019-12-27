import GooglePlaces

extension AppState {
    struct LocationState: Equatable {
        var showSearch = false
        var search = ""
        var searchResults: [CLLocation] = []
        var lastKnown: CLLocation? = nil
        var isOnCurrent = false
        var hasChangedOnce = false
    }
}

enum LocationAction {
    case goToCurrent
    case setLastKnown(_ location: CLLocation?)
    case setSearch(_ search: String)
    case setSearchResults(_ locations: [CLLocation])

}

func locationReducer(_ state: inout AppState, action: LocationAction) {
    switch action {
        case .goToCurrent:
            state.location.isOnCurrent = true
        case let .setLastKnown(location):
            state.location.lastKnown = location
        case let .setSearchResults(locations):
            state.location.searchResults = locations
        case let .setSearch(search):
            state.location.search = search
    }
}
