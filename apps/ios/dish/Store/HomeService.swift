import SwiftUI
import Combine
import MapKit

class HomeService {
    private var cancels: Set<AnyCancellable> = []
    
    func start() {
        self.affectSearchResults()
    }
    
    struct SearchQuery: Equatable {
        let query: String
        let location: MapViewLocation
    }
    
    func affectSearchResults() {
        App.store.$state
            .debounce(for: .milliseconds(200), scheduler: App.queueMain)
            .map { state in
                SearchQuery(
                    query: state.home.viewStates.last!.queryString,
                    location: state.map.location ?? MapViewLocation(center: .none)
                )
            }
            .removeDuplicates()
            // for now dont run if no search query
            .filter { $0.query != "" }
            .sink { val in
                App.store.send(self.doSearch(val))
            }
            .store(in: &cancels)
    }
    
    func getSearchResults(_ search: SearchQuery) -> Future<HomeStateItem.SearchResults, Never> {
        Future<HomeStateItem.SearchResults, Never> { promise in
            let query = SearchRestaurantsQuery(
                radius: search.location.radius / 100000,
                geo: [
                    "type": "Point",
                    "coordinates": [
                        search.location.coordinate?.longitude ?? 0.0,
                        search.location.coordinate?.latitude ?? 0.0
                    ]
                ]
            )
            App.apollo.fetch(query: query) { result in
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
                            HomeStateItem.SearchResults(
                                id: "0",
                                results: data.restaurant.map { restaurant in
                                    let coords = restaurant.location?["coordinates"] as! [Double]
                                    return HomeStateItem.Item(
                                        id: restaurant.name,
                                        name: restaurant.name,
                                        coordinate: .init(latitude: coords[1], longitude: coords[0])
                                    )
                                }
                            )
                        ))
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
