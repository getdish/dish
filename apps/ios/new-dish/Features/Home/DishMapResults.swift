import SwiftUI

struct DishMapResults: View {
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var homeState: HomeViewState
    @State var dragX: CGFloat = 0
    
    var body: some View {
        let isOnSearchResults = Selectors.home.isOnSearchResults()
        return (
            ZStack {
                if isOnSearchResults {
                    ForEach(self.store.state.home.state) { state in
                        DishMapDishResults(state: state)
                    }
                } else {
                  DishMapExploreResults()
                }
            }
        )
    }
}

struct DishMapDishResults: View {
    var state: HomeStateItem

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack {
                ForEach(state.searchResults.results) { item in
                    DishRestaurantCard(
                        restaurant: RestaurantItem(
                            id: 0,
                            name: item.name,
                            imageName: "turtlerock",
                            address: "",
                            phone: "",
                            tags: [],
                            rating: 8
                        ),
                        aspectRatio: 1.8,
                        isMini: true
                    )
                    .frame(width: 160, height: cardRowHeight)
                    .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 5)
                }
                Spacer().frame(height: bottomNavHeight)
            }
            .padding(.horizontal)
        }
        .frame(width: Screen.width)
    }
}

struct DishMapExploreResults: View {
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack {
                ForEach(features) { item in
                    DishCardView(dish: item)
                        .frame(width: 160, height: cardRowHeight)
                        .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 5)
                }
                Spacer().frame(height: bottomNavHeight)
            }
            .padding(.horizontal)
        }
        .frame(width: Screen.width)
    }
}

