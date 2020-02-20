import SwiftUI

struct DishLenseFilterBar: View {
    @EnvironmentObject var store: AppStore
    @State var index = 0
    
    var body: some View {
        VStack(spacing: 0) {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 6) {
                    ForEach(0 ..< self.store.state.home.labels.count - 1) { index in
                        DishButton(action: {
                            self.index = index
                        }) {
                            HStack {
                                Text(self.store.state.home.labels[index])
                                    .font(.system(size: 17))
                            }
                            .modifier(
                                TopNavButtonStyle(
                                    active: index == self.index,
                                    height: 38
                                )
                            )
                        }
                    }
                }
                .padding(.horizontal, 20 - 3)
                .padding(.bottom, 8)
                .padding(.top, 12)
            }
        }
    }
}

struct HomeMapSearchResults: View {
    @EnvironmentObject var store: AppStore
    @State var index = 0
    
    let width: CGFloat = max(100, (App.screen.width - 40) * 0.35)
    let height: CGFloat = 130
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
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
                        width: self.width,
                        height: self.height
                    )
                    // .equatable() may help
                }
            }
            .padding(20)
            .frame(height: self.height + 40)
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
    //        .frame(width: App.screen.width, height: cardRowHeight - 40 + extraHeight)
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
//            .frame(width: App.screen.width - 40, height: cardRowHeight - 40)
//    }
//}



// scroll view enhanced version start:

//struct HomeMapExplore: View {
//    @EnvironmentObject var store: AppStore
//    @State var index: Int = 0
//
//    var body: some View {
//        ScrollViewEnhanced(
//            index: self.$index,
//            direction: .horizontal,
//            showsIndicators: false,
//            pages: (0..<features.count).map { index in
//                MapResultDishCard(dish: features[index])
//            }
//        )
//            .frame(width: App.screen.width, height: cardRowHeight)
//        //        .padding(20)
//    }
//}

//struct MapResultDishCard: View, Identifiable {
//    var dish: DishItem
//    var id: Int { self.dish.id }
//
//    var body: some View {
//        DishCardView(
//            dish: dish,
//            at: .end,
//            display: .card
//        )
//            .frame(width: 150, height: cardRowHeight - 40)
//    }
//}

