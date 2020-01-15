import SwiftUI

struct HomeSearchResultsView: View {
    var state: HomeStateItem
    
    var body: some View {
        ZStack {
            Color.black

            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 20) {
                    ClearKeyboardOnScroll()

                    ForEach(state.searchResults.results) { item in
                        DishRestaurantCard(restaurant:
                            RestaurantItem(
                                id: 0,
                                name: item.name,
                                imageName: "turtlerock",
                                address: "",
                                phone: "",
                                tags: [],
                                rating: 8
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

struct DishRestaurantCard: View {
    var restaurant: RestaurantItem
    var aspectRatio: CGFloat = 2 / 2
    var isMini: Bool = false
    
    var gradientBottom: LinearGradient {
        LinearGradient(
            gradient: Gradient(
                colors: [Color.black.opacity(0.6), Color.black.opacity(0)]),
            startPoint: .bottom,
            endPoint: .center)
    }
    
    var gradientTop: LinearGradient {
        LinearGradient(
            gradient: Gradient(
                colors: [Color.black.opacity(0.6), Color.black.opacity(0)]),
            startPoint: .top,
            endPoint: .center)
    }

    var body: some View {
        let isMini = self.isMini
        let ratingSize: CGFloat = isMini ? 25 : 50
        
        return ZStack {
            restaurant.image
                .resizable()
                .aspectRatio(aspectRatio, contentMode: .fit)
                .cornerRadius(16)
            
            ZStack(alignment: .bottomLeading) {
                Rectangle().fill(gradientBottom)
                
                HStack {
                    VStack(alignment: .leading, spacing: 16) {
                        VStack(alignment: .leading) {
                            Text(restaurant.name)
                                .font(.system(size: isMini ? 14 : 22))
                                .bold()
                                .modifier(TextShadowModifier())
                        }
                        
                        HStack {
                            CardTagView("Cheap")
                            
                            if !isMini {
                                HStack(spacing: 6) {
                                    Group {
                                        Text("Open")
                                            .font(.system(size: 14))
                                            .foregroundColor(.green).fontWeight(.semibold)
                                        Text("to 9:00pm")
                                            .font(.system(size: 14))
                                    }
                                    .modifier(TextShadowModifier())
                                }
                            }
                        }
                        .environment(\.colorScheme, .light)
                    }
                    
                    Spacer()
                    
                    ZStack {
                        Circle()
                            .frame(width: ratingSize, height: ratingSize)
                            .modifier(TextShadowModifier())
                    
                        Text("9")
                            .font(.system(size: ratingSize * 0.6))
                            .foregroundColor(.black)
                    }
                }
                .padding(isMini ? 4 : 12)
            }
            .foregroundColor(.white)

            
            // left right pagination
            
            HStack {
                Color.black.opacity(0.0001)
                    .onTapGesture {
                        print("prev!")
                        self.restaurant.prev()
                    }
                
                Color.clear
                
                Color.black.opacity(0.0001)
                    .onTapGesture {
                        print("next!")
                        self.restaurant.next()
                }
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

struct TextShadowModifier: ViewModifier {
    func body(content: Content) -> some View {
        content.shadow(color: Color.black.opacity(0.5), radius: 2, x: 0, y: 1)
    }
}

#if DEBUG
struct HomeSearchResults_Previews: PreviewProvider {
    static var previews: some View {
        HomeSearchResultsView(
            state: HomeStateItem(filters: [SearchFilter(name: "Pho")])
        )
            .embedInAppEnvironment()
    }
}
#endif
