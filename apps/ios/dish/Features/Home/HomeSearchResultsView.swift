import SwiftUI

struct HomeSearchResultsView: View {
    var state: HomeStateItem
    
    var body: some View {
        ZStack {
            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 20) {
//                    ClearKeyboardOnScroll()
                    
                    Spacer().frame(height: 20)

                    ForEach(state.searchResults.results) { item in
                        DishRestaurantCard(restaurant:
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
                    }
                    
                    // space for bottom bottomnav
                    Spacer().frame(height: 90)
                }
                .padding(16)
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
            state: HomeStateItem(dishes: [DishFilterItem(name: "Pho")])
        )
            .embedInAppEnvironment()
    }
}
#endif
