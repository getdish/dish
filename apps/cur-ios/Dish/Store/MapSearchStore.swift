import Combine
import GooglePlaces

struct MapSearchResult: Identifiable {
  var id: String
  var name: String
}

let token = GMSAutocompleteSessionToken.init()

class MapSearchStore: ObservableObject {
  @Published var showResults = false {
    didSet {
      UIApplication.shared.endEditing(true)
    }
  }
  
  @Published var search = "" {
    didSet {
      searchPlaces(search)
    }
  }
  
  @Published var results: [MapSearchResult] = []
  private var placesClient = GMSPlacesClient.shared()
  private var cancel: AnyCancellable?
  private let filter = GMSAutocompleteFilter()
  
  init() {
    filter.type = .establishment
    self.goToCurrentPlace()
  }
  
  func goToCurrentPlace() {
    placesClient.currentPlace(callback: { (placeLikelihoodList, error) -> Void in
      if let error = error {
        print("Current Place error: \(error.localizedDescription)")
        return
      }
      if let placeLikelihoodList = placeLikelihoodList {
        self.results = placeLikelihoodList.likelihoods.map {
          MapSearchResult(
            id: $0.place.placeID!,
            name: $0.place.name!
          )
        }
      }
    })
  }
  
  func searchPlaces(_ search: String) {
    placesClient.findAutocompletePredictions(
      fromQuery: search,
      bounds: nil,
      boundsMode: GMSAutocompleteBoundsMode.bias,
      filter: filter,
      sessionToken: token,
      callback: { (results, error) in
        if let error = error {
          print("Autocomplete error: \(error)")
          return
        }
        if let results = results {
          self.results = results.map {
            MapSearchResult(
              id: $0.placeID,
              name: $0.attributedFullText.string
            )
          }
        }
    })
  }
}

