import SwiftUI
import MapKit

// harcode for now
let images = [
  "turtlerock",
  "silversalmoncreek",
  "chilkoottrail",
  "stmarylake",
  "twinlake",
  "lakemcdonald",
  "charleyrivers",
  "icybay",
]

struct RestaurantItem: Codable, Identifiable, Equatable {
  var id: String
  var name: String
  var imageName: String = ""
  var address: String = ""
  var phone: String = ""
  var tags: [String] = []
  var stars: Int = 0
  var coordinate: [Double] = [0, 0]
  
  var image: Image {
    ImageStore.shared.image(name: self.imageName)
  }
  
  var coordinate2D: CLLocationCoordinate2D {
    .init(latitude: self.coordinate[0], longitude: self.coordinate[1])
  }

  private enum CodingKeys: String, CodingKey {
    case id, name, imageName, address, phone, tags, stars
  }
}

class RestaurantItemLive: ObservableObject {
  var restaurant: RestaurantItem
  
  init(restaurant: RestaurantItem) {
    self.restaurant = restaurant
  }
  
  @Published var imageIndex = 0
  
  var image: Image {
    ImageStore.shared.image(name: imageIndex == 0 ? restaurant.imageName : images[imageIndex])
  }
  
  func next() {
    self.imageIndex = min(images.count - 1, self.imageIndex + 1)
  }
  
  func prev() {
    self.imageIndex = max(0, self.imageIndex - 1)
  }
}

