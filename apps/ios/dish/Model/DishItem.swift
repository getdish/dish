import SwiftUI

struct DishItem: Hashable, Codable, Identifiable {
  var id: Int
  var name: String
  var hue: Double
  fileprivate var imageName: String

  var image: Image {
    ImageStore.shared.image(name: imageName)
  }
}
