import SwiftUI

struct HomeDrawerSearchResultsView: View {
  var state: HomeStateItem

  var body: some View {
    let results = state.searchResults?.results ?? []
    return VStack(spacing: 20) {      
      ForEach(results) { item in
        DishRestaurantResult(restaurant: item, rank: (results.firstIndex(of: item) ?? 0) + 1)
      }
    }
  }
}

struct DishRestaurantResult: View {
  @EnvironmentObject var screen: ScreenModel
  @State var isScrolled = false
  var restaurant: RestaurantItem
  var rank: Int

  var body: some View {
    DishButton(action: {
      App.store.send(.home(.navigateToRestaurant(self.restaurant)))
    }) {
      ListItemGallery(
        defaultImagesVisible: 1.2,
        displayContent: .fixed,
        getImage: { (index, size, isActive) in
          (restaurants.count > index ? restaurants[index] : restaurants[0])
            .image
            .resizable()
            .scaledToFill()
            .frame(width: size, height: size)
            .cornerRadiusSquircle(16)
      },
        imageSize: 115,
        total: 4
      ) {
        HStack(spacing: 12) {
          VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 10) {
              Text("\(self.rank).")
                .font(.system(size: 18))
                .frame(width: 36, height: 36)
                .background(Color(.systemBackground))
                .cornerRadius(32)
                .rotationEffect(.degrees(-10))
                .offset(x: -5, y: 0)
              
              Text(self.restaurant.name)
                .fontWeight(.bold)
                .lineLimit(2)
                .font(.system(size: 18))
                .modifier(TextShadowStyle())
            }
            
            HStack(spacing: 8) {
              Group {
                Text("Open")
                  .font(.system(size: 14))
                  .foregroundColor(.green).fontWeight(.semibold)
                Text("9:00pm")
                  .font(.system(size: 14))
              }
              .modifier(TextShadowStyle())
            }
            
            HStack {
              RestaurantLenseView(lense: LenseItem(name: "Cheap"))
              RestaurantLenseView(lense: LenseItem(name: "Vegan"))
            }
          }
          
          Spacer()
        }
      }
    }
  }
}

struct TextShadowStyle: ViewModifier {
  func body(content: Content) -> some View {
    content.shadow(color: Color.black.opacity(0.4), radius: 1, x: 0, y: 1)
  }
}

#if DEBUG
  struct HomeSearchResults_Previews: PreviewProvider {
    static var previews: some View {
      HomeDrawerSearchResultsView(
        state: HomeStateItem(state: .search(search: "Pho"))
      )
        .embedInAppEnvironment()
    }
  }
#endif
