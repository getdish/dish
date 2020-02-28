import SwiftUI

struct HomeSearchResultsView: View {
    var state: HomeStateItem
    
    var body: some View {
        VStack(spacing: 20) {
            ForEach(state.searchResults?.results ?? []) { item in
                DishRestaurantResult(restaurant:
                    RestaurantItem(
                        id: item.id,
                        name: item.name,
                        imageName: "turtlerock",
                        address: "",
                        phone: "",
                        tags: [],
                        stars: 3
                    )
                )
                .equatable()
            }
        }
    }
}

struct DishRestaurantResult: View, Equatable {
    static func == (lhs: DishRestaurantResult, rhs: DishRestaurantResult) -> Bool {
        lhs.restaurant == rhs.restaurant
    }
    
    @EnvironmentObject var screen: ScreenModel
    @State var isScrolled = false
    var restaurant: RestaurantItem
    
    var body: some View {
        ListItemHScroll(isScrolled: self.$isScrolled) {
            HStack {
                DishButton(action: {
//                    App.store.send(
//                        .home(.push(HomeStateItem(search: self.dish.name)))
//                    )
                }) {
                    HStack(alignment: .top) {
                        VStack {
                            Text("\(self.restaurant.name)")
                                .fontWeight(.light)
                                .lineLimit(1)
                                .font(.system(size: 22))
                            
                            HStack {
                                Text("\(self.restaurant.address)")
                                    .lineLimit(1)
                                    .font(.system(size: 15))
                                
                                Text("\(self.restaurant.phone)")
                                    .lineLimit(1)
                                    .font(.system(size: 15))
                                
                            }
                            
                            Text("\(self.restaurant.tags.joined(separator: ", "))")
                                .lineLimit(1)
                                .font(.system(size: 15))
                        }
                        
                        Spacer()
                    }
                    .padding(.horizontal)
                    .frame(width: self.screen.width - 120 - 20)
                }
                
                DishRestaurantCard(restaurant: self.restaurant)
            }
        }
    }
}

struct CardTagView: View {
    let content: String
    
    init(_ content: String) {
        self.content = content
    }
    
    var body: some View {
        VStack {
            Text(self.content)
                .font(.system(size: 14))
                .foregroundColor(.black)
        }
        .padding(.vertical, 2)
        .padding(.horizontal, 8)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.2), radius: 2, y: 2)
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
        HomeSearchResultsView(
            state: HomeStateItem(state: .search(search: "Pho"))
        )
            .embedInAppEnvironment()
    }
}
#endif
