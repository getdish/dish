import SwiftUI

struct GooglePlaceItem: Identifiable, Hashable, Codable {
    var id: String
    struct Geometry: Codable, Hashable {
        struct Location: Codable, Hashable {
            var lat: Float
            var lng: Float
        }
        var location: Location
    }
    var geometry: Geometry
    var icon: String
    var name: String
    var formatted_address: String
    
    var price_level: Int? = 0
    var rating: Double? = 0.0
    var user_ratings_total: Int? = 0
    
//    struct OpeningHours: Codable, Hashable {
//        var open_now: Int
//    }
//    var opening_hours: OpeningHours? = nil
    
    struct Photo: Codable, Hashable {
        var height: Int
        var width: Int
        var photo_reference: String
        var html_attributions: [String]
    }
    var photos: [Photo]? = nil
    
    var place_id: String
    var reference: String
    var types: [String]
    // enum CodingKeys
    
    init(dictionary: [String: Any]) throws {
        self = try JSONDecoder().decode(GooglePlaceItem.self, from: JSONSerialization.data(withJSONObject: dictionary))
    }
}
