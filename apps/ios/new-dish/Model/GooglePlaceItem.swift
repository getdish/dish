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
    
    struct OpeningHours: Codable, Hashable {
        var open_now: String
    }
    var opening_hours: OpeningHours
    
    struct Photo: Codable, Hashable {
        var height: Int
        var width: Int
        var photo_reference: String
        var html_attributions: [String]
    }
    var photos: [Photo]
    
    var place_id: String
    var reference: String
    var types: [String]
    var vicinity: String
    
    // enum CodingKeys
}
