import SwiftUI
import Combine
import GoogleMaps

class HomeService {
    private var cancels: Set<AnyCancellable> = []
    
    func start() {
        self.affectSearchResults()
    }
    
    struct SearchQuery: Equatable {
        let query: String
        let location: MapLocationState
    }
    
    func affectSearchResults() {
        App.store.$state
            .map { state in
                SearchQuery(
                    query: state.home.state.last!.queryString,
                    location: state.map.location
                )
            }
            .removeDuplicates()
            .debounce(for: .milliseconds(200), scheduler: RunLoop.main)
            .sink { val in
                App.store.send(self.doSearch(val))
        }
        .store(in: &cancels)
    }
    
    func getSearchResults(_ search: SearchQuery) -> Future<HomeSearchResults, Never> {
        Future<HomeSearchResults, Never> { promise in
            App.googlePlacesService.searchPlaces(
                search.query,
                location: CLLocationCoordinate2D(latitude: search.location.latitude, longitude: search.location.longitude),
                radius: search.location.radius,
                completion: { places in
                    promise(.success(
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
                        ))
                })
        }
    }
    
    func doSearch(_ search: SearchQuery) -> Effect<AppAction> {
        self.getSearchResults(search)
            .map { results in
                AppAction.home(.setSearchResults(results))
        }
        .eraseToEffect()
    }
}
