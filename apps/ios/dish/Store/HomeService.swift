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
                    query: state.home.viewStates.last!.queryString,
                    location: state.map.location
                )
            }
            .removeDuplicates()
            .debounce(for: .milliseconds(200), scheduler: App.queueMain)
            .sink { val in
                App.store.send(self.doSearch(val))
        }
        .store(in: &cancels)
    }
    
    func getSearchResults(_ search: SearchQuery) -> Future<HomeSearchResults, Never> {
        Future<HomeSearchResults, Never> { promise in
            App.apollo.fetch(query: SearchRestaurantsQuery()) { result in
                switch result {
                    case .success(let result):
                        if result.errors?.count ?? 0 > 0 {
                            print("errors in search")
                            return
                        }
                        guard let data = result.data else {
                            print("no results")
                            return
                        }
                        promise(.success(
                            HomeSearchResults(
                                id: "0",
                                results: data.restaurant.map { restaurant in
                                    let coords = restaurant.location?["coordinates"] as! [Double]
                                    return HomeSearchResultItem(
                                        id: restaurant.name,
                                        name: restaurant.name,
                                        coordinate: .init(lat: coords[1], long: coords[0])
                                    )
                                }
                            )
                        ))
                        print("got \(result)")
                    case .failure(let err):
                        print("err \(err)")
                }
            }
            
//            App.googlePlacesService.searchPlaces(
//                search.query,
//                location: CLLocationCoordinate2D(latitude: search.location.latitude, longitude: search.location.longitude),
//                radius: search.location.radius,
//                completion: { places in
//                    promise(.success(
//                        HomeSearchResults(
//                            id: "0",
//                            results: places.map { place in
//                                HomeSearchResultItem(
//                                    id: place.name,
//                                    name: place.name, //place.attributedPrimaryText,
//                                    place: place
//                                )
//                            }
//                        )
//                        ))
//                }
//            )
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
