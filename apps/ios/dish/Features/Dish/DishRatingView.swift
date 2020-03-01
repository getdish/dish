import SwiftUI

struct DishRatingView: View {
  var isMini: Bool
  var restaurant: RestaurantItem
  var ratingSize: CGFloat { isMini ? 25 : 45 }
  var starWidth: CGFloat { ratingSize * 0.525 * 0.6 }

  var body: some View {
    VStack {
      Spacer()
      HStack {
        if self.restaurant.stars > 2 {
          Text("⭐️")
            .offset(x: -4, y: 4)
        }
        Spacer()
      }
    }
  }
}
