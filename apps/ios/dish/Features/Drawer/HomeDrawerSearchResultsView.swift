import SwiftUI

struct HomeDrawerSearchResultsView: View {
  var state: HomeStateItem

  var body: some View {
    let results = state.searchResults?.results ?? []
    return VStack(spacing: 30) {
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
        defaultImagesVisible: 1.3,
        displayContent: .fixed,
        getImage: { (index, size, isActive) in
          (restaurants.count > index ? restaurants[index] : restaurants[0])
            .image
            .resizable()
            .scaledToFill()
            .frame(width: size, height: size)
            .cornerRadiusSquircle(16)
      },
        imageSize: 120,
        total: 4
      ) {
        HStack(alignment: .top, spacing: 12) {
          RatingNumberView(number: self.rank)
            .invertColorScheme()
          
          VStack(alignment: .leading, spacing: 8) {
            HStack {
              Text(self.restaurant.name)
                .fontWeight(.semibold)
                .lineLimit(2)
                .fixedSize(horizontal: false, vertical: true)
                .font(.system(size: 18))
                .modifier(TextShadowStyle())
            }
            
            HStack(spacing: 8) {
              Group {
                Text("1,200 reviews")
                  .font(.system(size: 14))
                  .opacity(0.5)
              }
              .modifier(TextShadowStyle())
              
              Spacer()
            }
            
            HStack {
              Group {
                Text("Open")
                  .font(.system(size: 14))
                  .foregroundColor(.green).fontWeight(.semibold)
                Text("9:00pm")
                  .opacity(0.7)
                  .font(.system(size: 14))
              }
              .modifier(TextShadowStyle())
            }
            
            HStack {
              RestaurantLenseView(lense: LenseItem(name: "Cheap"), hideRank: true)
              RestaurantLenseView(lense: LenseItem(name: "Vegan"), hideRank: true)
            }
          }
          .offset(x: -30, y: 0)
        }
      }
    }
  }
}

struct RatingNumberView: View {
  var number: Int
  
  @Environment(\.colorScheme) var colorScheme
  
  var body: some View {
    let bg: Color = colorScheme == .dark ? .black : .white
    
    return Color.clear
      .frame(width: 36, height: 36)
      .background(bg)
      .overlay(
        ZStack {
          Text("\(self.number)")
            .font(.system(size: self.number > 9 ? 20 : 28, design: .rounded))
            .fontWeight(.bold)
            .offset(x: 5, y: 4)
            .background(
              Text("#")
                .font(.system(size: 16))
                .fontWeight(.bold)
                .opacity(0.34)
                .offset(x: 2, y: -8)
          )
          
//          LinearGradient(
//            gradient: Gradient(colors: [bg.opacity(0), bg]),
//            startPoint: .center,
//            endPoint: .bottomTrailing
//          )
        }
    )
      .cornerRadius(32)
      .rotationEffect(.degrees(-15))
//      .scaleEffect(1.1)
      .offset(x: -29, y: -8)
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
        state: HomeStateItem(state: .search(search: "Pho", results: .init(status: .completed, results: restaurants)))
      )
        .embedInAppEnvironment()
        .background(Color.black)
        .invertColorScheme()
    }
  }
#endif
