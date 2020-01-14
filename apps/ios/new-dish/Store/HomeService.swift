import SwiftUI
import Combine
import GoogleMaps

class HomeService {
    private var cancels: Set<AnyCancellable> = []
    
    func start() {
        self.effectSearchResultsOnSearch()
    }
    
    func getSearchResults(_ search: String) -> Future<HomeSearchResults, Never> {
        Future<HomeSearchResults, Never> { promise in
            App.googlePlacesManager.searchPlaces(search, completion: { places in
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
    
    func setSearchResults(_ search: String) -> Effect<AppAction> {
        self.getSearchResults(search)
            .map { results in
                AppAction.home(.setSearchResults(results))
        }
        .eraseToEffect()
    }
    
    func effectSearchResultsOnSearch() {
        App.store.$state
            .map { $0.home.state.last!.queryString }
            .removeDuplicates()
            .debounce(for: .milliseconds(100), scheduler: App.defaultQueue)
            .sink { val in
                print("we got a new state........... \(val)")
                App.store.send(self.setSearchResults(val))
        }
        .store(in: &cancels)
    }
}
