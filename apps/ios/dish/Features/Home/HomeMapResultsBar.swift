import SwiftUI

struct HomeMapResultsBar: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.colorScheme) var colorScheme

    var body: some View {
        VStack {
            Group {
                if Selectors.home.isOnSearchResults(self.store) {
                    HomeMapSearchResults()
                        .transition(.slide)
                } else {
                    HomeMapExplore()
                        .transition(.slide)
                }
            }
            
            // account for DishLenseBar  - todo make this a variable
            Spacer().frame(height: 120)
        }
        .background(
            self.colorScheme == .dark
              ? LinearGradient(
                    gradient: Gradient(colors: [.clear, .black]),
                    startPoint: .top,
                    endPoint: .center
                )
              : LinearGradient(
                gradient: Gradient(colors: [Color.clear, Color.init(white: 0, opacity: 0.5)]),
                    startPoint: .top,
                    endPoint: .bottom
                )
        )
    }
}

struct HomeMapExplore: View {
    @EnvironmentObject var store: AppStore
    @State var index: Int = 0

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(features) { item in
                    MapResultDishCard(dish: item)
                    //                    DishButtonView(dish: item, at: .start)
                }
            }
            .padding(.horizontal, 20)
        }
        .frame(width: App.screen.width, height: App.mapBarHeight)
//        ScrollViewEnhanced(
//            index: self.$index,
//            direction: .horizontal,
//            showsIndicators: false,
//            pages: (0..<features.count).map { index in
//                MapResultDishCard(dish: features[index])
//            }
//        )
    }
}

struct HomeMapSearchResults: View {
    @EnvironmentObject var store: AppStore
    @State var index = 0
    
    var body: some View {
        let width: CGFloat = max(100, (App.screen.width - 40) * 0.35)

        return ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 16) {
                ForEach(Selectors.home.lastState().searchResults.results) { item in
                    DishRestaurantCard(
                        restaurant: RestaurantItem(
                            id: item.id,
                            name: item.name,
                            imageName: "turtlerock",
                            address: "",
                            phone: "",
                            tags: [],
                            stars: 3
                        ),
                        isMini: true,
                        at: .end,
                        width: width,
                        height: App.mapBarHeight
                    )
                        .frame(width: width, height: App.mapBarHeight)
                    // .equatable() may help
                }
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 10)
            .frame(height: App.mapBarHeight)
        }
    }
    
    // almost working
    //        ScrollViewEnhanced(
    //            index: self.$index,
    //            direction: .horizontal,
    //            showsIndicators: false,
    //            pages: Selectors.home.lastState().searchResults.results.map { item in
    //                MapResultRestaurantCard(
    //                    restaurant: RestaurantItem(
    //                        id: item.id,
    //                        name: item.name,
    //                        imageName: "turtlerock",
    //                        address: "",
    //                        phone: "",
    //                        tags: [],
    //                        rating: 8
    //                    )
    //                )
    //            }
    //        )
    //        .frame(width: App.screen.width, height: App.mapBarHeight - 40 + extraHeight)
    //        .offset(y: -extraHeight + 10)
}

//struct MapResultRestaurantCard: View, Identifiable {
//    var restaurant: RestaurantItem
//    var id: String { self.restaurant.id }
//    var body: some View {
//        DishRestaurantCard(
//            restaurant: self.restaurant,
//            isMini: true,
//            at: .end
//        )
//            .frame(width: App.screen.width - 40, height: App.mapBarHeight - 40)
//    }
//}

// scroll view enhanced version start:

struct MapResultDishCard: View, Identifiable {
    var dish: DishItem
    var id: Int { self.dish.id }

    var body: some View {
        DishCardView(
            dish: dish,
            display: .small,
            height: App.mapBarHeight - 10
        )
            .frame(width: 120, height: App.mapBarHeight)
    }
}

