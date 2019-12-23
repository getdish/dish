import SwiftUI

struct RestaurantItem: Hashable, Codable, Identifiable {
    var id: Int
    var name: String
    fileprivate var imageName: String
    var image: Image {
        ImageStore.shared.image(name: imageName)
    }
}
