import SwiftUI

struct DishItem: Hashable, Codable, Identifiable {
  var id: Int
  var name: String
  fileprivate var imageName: String
  var address: String
  var phone: String
  var tags: [String]
  var rating: Double

  var image: Image {
    ImageStore.shared.image(name: imageName)
  }
}
