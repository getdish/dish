import SwiftUI

// harcode for now
let images = [
    "turtlerock",
    "silversalmoncreek",
    "chilkoottrail",
    "stmarylake",
    "twinlake",
    "lakemcdonald",
    "charleyrivers",
    "icybay"
]

class RestaurantItem: Codable, Identifiable, ObservableObject, Equatable {
    static func == (lhs: RestaurantItem, rhs: RestaurantItem) -> Bool {
        lhs.id == rhs.id
    }
    
    var id: String
    var name: String
    var imageName: String
    var address: String
    var phone: String
    var tags: [String]
    var stars: Int
    
    init(
        id: String,
        name: String,
        imageName: String,
        address: String,
        phone: String,
        tags: [String],
        stars: Int
    ) {
        self.id = id
        self.name = name
        self.imageName = imageName
        self.address = address
        self.phone = phone
        self.tags = tags
        self.stars = stars
    }
    
    private enum CodingKeys: String, CodingKey {
        case id, name, imageName, address, phone, tags, stars
    }

    @Published var imageIndex = 0

    var image: Image {
        ImageStore.shared.image(name: imageIndex == 0 ? imageName : images[imageIndex])
    }
    
    func next() {
        self.imageIndex = min(images.count - 1, self.imageIndex + 1)
    }
    
    func prev() {
        self.imageIndex = max(0, self.imageIndex - 1)
    }
}
