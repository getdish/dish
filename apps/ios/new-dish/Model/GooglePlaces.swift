import UIKit
import CoreLocation
import GoogleMaps
import GooglePlaces

struct GooglePlaces {
    private var apiKey = ""
    private var placeType: PlaceType = .all
    private var currentLocation: CLLocationCoordinate2D = kCLLocationCoordinate2DInvalid
    private var radius: Double = 10.0
    private var strictBounds = true
    
    func searchPlaces(_ search: String, completion: @escaping ([PlaceDetails]) -> Void) {
        GooglePlacesRequestHelpers.getPlaces(with: getParameters(for: search), completion: { places in
            var loaded = 0
            var placesWithDetails: [PlaceDetails] = []
            
            (0 ..< places.count).forEach { index in
                let place = places[index]
                
                GooglePlacesRequestHelpers.getPlaceDetails(
                    id: place.id,
                    apiKey: self.apiKey,
                    completion: { placeDetails in
                        guard let pd = placeDetails else {
                            print("bad")
                            return
                        }
                        placesWithDetails[index] = pd
                        loaded += 1
                        // done
                        print("loaded \(loaded) places \(places.count)")
                        if loaded == places.count {
                            completion(placesWithDetails)
                        }
                    }
                )
            }
        })
    }
    
    private let placesClient = GMSPlacesClient.shared()
    private let filter = GMSAutocompleteFilter()
    private let token = GMSAutocompleteSessionToken.init()
    
    func getCurrentPlace() {
        placesClient.currentPlace(callback: { (placeLikelihoodList, error) -> Void in
            if let error = error {
                print("Current Place error: \(error.localizedDescription)")
                return
            }
            if let placeLikelihoodList = placeLikelihoodList {
                //                self.results = placeLikelihoodList.likelihoods.map {
                //                    MapSearchResult(
                //                        id: $0.place.placeID!,
                //                        name: $0.place.name!
                //                    )
                //                }
            }
        })
    }
    
    private func getParameters(for text: String) -> [String: String] {
        var params = [
            "input": text,
            "types": placeType.rawValue,
            "key": self.apiKey
        ]
        
        if CLLocationCoordinate2DIsValid(currentLocation) {
            params["location"] = "\(currentLocation.latitude),\(currentLocation.longitude)"
            
            if radius > 0 {
                params["radius"] = "\(radius)"
            }
            
            if strictBounds {
                params["strictbounds"] = "true"
            }
        }
        
        return params
    }
}


public enum PlaceType: String {
    case all = ""
    case geocode
    case address
    case establishment
    case regions = "(regions)"
    case cities = "(cities)"
}

open class Place: NSObject {
    let id: String
    let mainAddress: String
    let secondaryAddress: String
    
    override open var description: String {
        get { return "\(mainAddress), \(secondaryAddress)" }
    }
    
    public init(id: String, mainAddress: String, secondaryAddress: String) {
        self.id = id
            self.mainAddress = mainAddress
            self.secondaryAddress = secondaryAddress
    }

    convenience public init(prediction: [String: Any]) {
        let structuredFormatting = prediction["structured_formatting"] as? [String: Any]

        self.init(
            id: prediction["place_id"] as? String ?? "",
            mainAddress: structuredFormatting?["main_text"] as? String ?? "",
            secondaryAddress: structuredFormatting?["secondary_text"] as? String ?? ""
        )
    }
}

open class PlaceDetails: CustomStringConvertible {
    public let formattedAddress: String
    open var name: String = ""
    
    open var streetNumber: String? = nil
    open var route: String? = nil
    open var postalCode: String? = nil
    open var country: String? = nil
    open var countryCode: String? = nil
    
    open var locality: String? = nil
    open var subLocality: String? = nil
    open var administrativeArea: String? = nil
    open var administrativeAreaCode: String? = nil
    open var subAdministrativeArea: String? = nil
    
    open var coordinate: CLLocationCoordinate2D? = nil
    
    init?(json: [String: Any]) {
        guard let result = json["result"] as? [String: Any],
            let formattedAddress = result["formatted_address"] as? String
            else { return nil }
        
        self.formattedAddress = formattedAddress
        self.name = result["name"] as? String ?? "none--"
        
        if let addressComponents = result["address_components"] as? [[String: Any]] {
            streetNumber = get("street_number", from: addressComponents, ofType: .short)
            route = get("route", from: addressComponents, ofType: .short)
            postalCode = get("postal_code", from: addressComponents, ofType: .long)
            country = get("country", from: addressComponents, ofType: .long)
            countryCode = get("country", from: addressComponents, ofType: .short)
            
            locality = get("locality", from: addressComponents, ofType: .long)
            subLocality = get("sublocality", from: addressComponents, ofType: .long)
            administrativeArea = get("administrative_area_level_1", from: addressComponents, ofType: .long)
            administrativeAreaCode = get("administrative_area_level_1", from: addressComponents, ofType: .short)
            subAdministrativeArea = get("administrative_area_level_2", from: addressComponents, ofType: .long)
        }
        
        if let geometry = result["geometry"] as? [String: Any],
            let location = geometry["location"] as? [String: Any],
            let latitude = location["lat"] as? CLLocationDegrees,
            let longitude = location["lng"] as? CLLocationDegrees {
            coordinate = CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
        }
    }
    
    open var description: String {
        return "\nAddress: \(formattedAddress)\ncoordinate: (\(coordinate?.latitude ?? 0), \(coordinate?.longitude ?? 0))\n"
    }
}

private extension PlaceDetails {
    
    enum ComponentType: String {
        case short = "short_name"
        case long = "long_name"
    }
    
    /// Parses the element value with the specified type from the array or components.
    /// Example: `{ "long_name" : "90", "short_name" : "90", "types" : [ "street_number" ] }`
    ///
    /// - Parameters:
    ///   - component: The name of the element.
    ///   - array: The root component array to search from.
    ///   - ofType: The type of element to extract the value from.
    func get(_ component: String, from array: [[String: Any]], ofType: ComponentType) -> String? {
        return (array.first { ($0["types"] as? [String])?.contains(component) == true })?[ofType.rawValue] as? String
    }
}

private class GooglePlacesRequestHelpers {
    
    static func doRequest(_ urlString: String, params: [String: String], completion: @escaping (NSDictionary) -> Void) {
        var components = URLComponents(string: urlString)
        components?.queryItems = params.map { URLQueryItem(name: $0, value: $1) }
        
        guard let url = components?.url else { return }
        
        let task = URLSession.shared.dataTask(with: url, completionHandler: { (data, response, error) in
            if let error = error {
                print("GooglePlaces Error: \(error.localizedDescription)")
                return
            }
            
            guard let data = data, let response = response as? HTTPURLResponse else {
                print("GooglePlaces Error: No response from API")
                return
            }
            
            guard response.statusCode == 200 else {
                print("GooglePlaces Error: Invalid status code \(response.statusCode) from API")
                return
            }
            
            let object: NSDictionary?
            do {
                object = try JSONSerialization.jsonObject(with: data, options: .mutableContainers) as? NSDictionary
            } catch {
                object = nil
                print("GooglePlaces Error")
                return
            }
            
            guard object?["status"] as? String == "OK" else {
                print("GooglePlaces API Error: \(object?["status"] ?? "")")
                return
            }
            
            guard let json = object else {
                print("GooglePlaces Parse Error")
                return
            }
            
            // Perform table updates on UI thread
            DispatchQueue.main.async {
                UIApplication.shared.isNetworkActivityIndicatorVisible = false
                completion(json)
            }
        })
        
        task.resume()
    }
    
    static func getPlaces(with parameters: [String: String], completion: @escaping ([Place]) -> Void) {
        var parameters = parameters
        if let deviceLanguage = deviceLanguage {
            parameters["language"] = deviceLanguage
        }
        doRequest(
            "https://maps.googleapis.com/maps/api/place/autocomplete/json",
            params: parameters,
            completion: {
                guard let predictions = $0["predictions"] as? [[String: Any]] else { return }
                completion(predictions.map { Place(prediction: $0) })
        }
        )
    }
    
    static func getPlaceDetails(id: String, apiKey: String, completion: @escaping (PlaceDetails?) -> Void) {
        var parameters = [ "placeid": id, "key": apiKey ]
        if let deviceLanguage = deviceLanguage {
            parameters["language"] = deviceLanguage
        }
        doRequest(
            "https://maps.googleapis.com/maps/api/place/details/json",
            params: parameters,
            completion: { completion(PlaceDetails(json: $0 as? [String: Any] ?? [:])) }
        )
    }
    
    private static var deviceLanguage: String? {
        return (Locale.current as NSLocale).object(forKey: NSLocale.Key.languageCode) as? String
    }
}
