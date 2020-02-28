import SwiftUI

struct DishRatingView: View {
  var isMini: Bool
  var restaurant: RestaurantItem
  var ratingSize: CGFloat { isMini ? 25 : 45 }
  var starWidth: CGFloat { ratingSize * 0.525 * 0.6 }

  var body: some View {
    VStack {
      HStack {
        HStack(spacing: 0) {
          ZStack {
            ForEach(0..<self.restaurant.stars) { index in
              Text("★")
                .font(.system(size: self.ratingSize * 0.525))
                .offset(x: CGFloat(index) * self.starWidth)
            }
          }
            .offset(x: -self.starWidth)
        }
          .frame(width: CGFloat(self.restaurant.stars) * self.starWidth)
          .padding(5)
          .background(Color.white.opacity(0.25))
          .cornerRadius(10)

        Spacer()
      }
      Spacer()
    }
  }
}
