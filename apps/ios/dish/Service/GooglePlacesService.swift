//import Combine
//import UIKit
//import CoreLocation
//import GoogleMaps
//import GooglePlaces
//
//class GooglePlacesService {
//    private var apiKey = "AIzaSyDhZI9uJRMpdDD96ITk38_AhRwyfCEEI9k"
//    private var strictBounds = true
//    private var cancellables: Set<AnyCancellable> = []
//    private let placesClient = GMSPlacesClient.shared()
//    private let filter = GMSAutocompleteFilter()
//    private let token = GMSAutocompleteSessionToken.init()
//
//    func searchPlaces(
//        _ search: String,
//        location: CLLocationCoordinate2D,
//        radius: Double = 1000,
//        completion: @escaping ([GooglePlaceItem]) -> Void
//    ) {
//        if !CLLocationCoordinate2DIsValid(location) {
//            print("invalid location!")
//        }
//        GooglePlacesRequestHelpers.getPlaces(
//            with: [
//                "key": self.apiKey,
//                "location": "\(location.latitude),\(location.longitude)",
//                "radius": "\(Int(radius))",
//                "query": search
//            ],
//            completion: completion
//        )
//    }
//}
//
//
//private class GooglePlacesRequestHelpers {
//
//    static func doRequest(_ urlString: String, params: [String: String], completion: @escaping (NSDictionary) -> Void) {
//        var components = URLComponents(string: urlString)
//        components?.queryItems = params.map { URLQueryItem(name: $0, value: $1) }
//
//        guard let url = components?.url else { return }
//
//        logger.info("doRequest \(url.absoluteString)")
//
//        let task = URLSession.shared.dataTask(with: url, completionHandler: { (data, response, error) in
//            if let error = error {
//                print("GooglePlaces Error: \(error.localizedDescription)")
//                return
//            }
//
//            guard let data = data, let response = response as? HTTPURLResponse else {
//                print("GooglePlaces Error: No response from API")
//                return
//            }
//
//            guard response.statusCode == 200 else {
//                print("GooglePlaces Error: Invalid status code \(response.statusCode) from API")
//                return
//            }
//
//            let object: NSDictionary?
//            do {
//                object = try JSONSerialization.jsonObject(with: data, options: .mutableContainers) as? NSDictionary
//            } catch {
//                object = nil
//                print("GooglePlaces Error")
//                return
//            }
//
//            guard object?["status"] as? String == "OK" else {
//                print("GooglePlaces API Error: \(object?["status"] ?? "")")
//                return
//            }
//
//            guard let json = object else {
//                print("GooglePlaces Parse Error")
//                return
//            }
//
//            // Perform table updates on UI thread
//            DispatchQueue.main.async {
//                UIApplication.shared.isNetworkActivityIndicatorVisible = false
//                completion(json)
//            }
//        })
//
//        task.resume()
//    }
//
//    static func getPlaces(with parameters: [String: String], completion: @escaping ([GooglePlaceItem]) -> Void) {
//        var parameters = parameters
//        if let deviceLanguage = deviceLanguage {
//            parameters["language"] = deviceLanguage
//        }
//        doRequest(
//            "https://maps.googleapis.com/maps/api/place/textsearch/json",
//            params: parameters,
//            completion: {
//                guard let results = $0["results"] as? [[String: Any]] else { return }
//                print("got results \(results.count)")
//                do {
//                    let res = try results.map({ dictionary in
//                        return try GooglePlaceItem(dictionary: dictionary)
//                    })
//                    completion(res)
//                } catch {
//                    print(error)
//                }
//        }
//        )
//
////        doRequest(
////            "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
////            params: parameters,
////            completion: {
////                guard let results = $0["results"] as? [[String: Any]] else { return }
////                completion(results.map { Place(result: $0) })
////        }
////        )
//    }
//
////    static func getPlaceDetails(id: String, apiKey: String, completion: @escaping (PlaceDetails?) -> Void) {
////        var parameters = [ "placeid": id, "key": apiKey ]
////        if let deviceLanguage = deviceLanguage {
////            parameters["language"] = deviceLanguage
////        }
////        doRequest(
////            "https://maps.googleapis.com/maps/api/place/details/json",
////            params: parameters,
////            completion: { completion(PlaceDetails(json: $0 as? [String: Any] ?? [:])) }
////        )
////    }
//
//    private static var deviceLanguage: String? {
//        return (Locale.current as NSLocale).object(forKey: NSLocale.Key.languageCode) as? String
//    }
//}
//
////func start() {
////    let locationManager = CurrentLocationService()
////    locationManager.start()
////    print("starting locationmanager")
////    locationManager.$lastLocation
////        .sink { location in
////            print("GOT OUR LOCATION BRO \(location)")
////            if let l = location {
////                self.currentLocation = CLLocationCoordinate2D(
////                    latitude: .init(l.coordinate.latitude),
////                    longitude: .init(l.coordinate.longitude)
////                )
////            } else {
////                self.currentLocation = CLLocationCoordinate2D(
////                    latitude: .init(37.7749),
////                    longitude: .init(122.4194)
////                )
////            }
////    }
////    .store(in: &cancellables)
////
////    // set current closest location
////    placesClient.currentPlace(callback: { (placeLikelihoodList, error) -> Void in
////        if let error = error {
////            print("Current Place error: \(error.localizedDescription)")
////            return
////        }
////        if let placeLikelihoodList = placeLikelihoodList {
////            guard let nearest = placeLikelihoodList.likelihoods.first else {
////                return
////            }
////            print("closest to place \(nearest)")
////            self.currentLocation = nearest.place.coordinate
////        }
////    })
////}
