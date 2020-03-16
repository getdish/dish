import Combine
import MapKit
import SwiftUI

class HomeSideEffects {
  private var cancels: Set<AnyCancellable> = []

  func start(_ store: AppStore) {
    self.affectSearchResults(store)
  }
}

// 

// search query => search results

extension HomeSideEffects {
  struct SearchQuery: Equatable {
    let query: String
    let location: MapViewLocation
  }
  
  func affectSearchResults(_ store: AppStore) {
    store.$state
      .debounce(for: .milliseconds(200), scheduler: App.queueMain)
      .map { state in
        SearchQuery(
          query: state.home.viewStates.last!.queryString,
          location: state.map.location
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
  
  func doSearch(_ search: SearchQuery) -> Effect<AppAction> {
    self.getSearchResults(search)
      .map { results in
        AppAction.home(.setSearchResults(results))
    }
    .eraseToEffect()
  }
  
  func getSearchResults(_ search: SearchQuery) -> Future<SearchResultRestaurant, Never> {
    Future<SearchResultRestaurant, Never> { promise in
      let query = SearchRestaurantsQuery(
        radius: search.location.radius / 100000,
        geo: [
          "type": "Point",
          "coordinates": [
            search.location.coordinate?.longitude ?? 0.0,
            search.location.coordinate?.latitude ?? 0.0
          ],
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
            promise(
              .success(SearchResultRestaurant(
                status: .completed,
                results: data.restaurant.map { x in
                  RestaurantItem(
                    id: "\(uid())",// x.id,
                    name: x.name,
                    imageName: "",
                    address: ""
                  )
                }
            )))
          case .failure(let err):
            print("err \(err)")
        }
      }
    }
  }
}
