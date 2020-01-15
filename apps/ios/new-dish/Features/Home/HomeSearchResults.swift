import SwiftUI

struct HomeSearchResultsView: View {
    var state: HomeStateItem
    
    var body: some View {
        ZStack {
            Color.black

            ScrollView(.vertical, showsIndicators: false) {
                VStack {
                    ClearKeyboardOnScroll()

                    // space below searchbar
                    Spacer().frame(height: 20)

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
    @ObservedObject var restaurant: RestaurantItem
    var aspectRatio: CGFloat = 2 / 2.25

    var body: some View {
        ZStack {
            restaurant.image
                .resizable()
                .aspectRatio(aspectRatio, contentMode: .fit)
                .overlay(RestaurantText(name: restaurant.name))
                .cornerRadius(16)
            
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

struct RestaurantText: View {
    var name: String
    
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
        ZStack {
            ZStack(alignment: .topLeading) {
                Rectangle().fill(gradientTop)
                
                HStack {
                    VStack(alignment: .leading) {
                        Text(name)
                            .font(.system(size: 22))
                            .bold()
                            .modifier(TextShadowModifier())
                    }
                    .padding()
                    
                    Spacer()
                    
                    VStack {
                        VStack {
                            Text("9")
                                .font(.system(size: 28))
                                .bold()
                                .foregroundColor(.blue)
                        }
                        .frame(width: 40, height: 40)
                        .background(Color.white)
                        .cornerRadius(100)
                    }
                }
            }
            
            ZStack(alignment: .bottomLeading) {
                Rectangle().fill(gradientBottom)
                
                HStack {
                    VStack(alignment: .leading, spacing: 16) {
                        HStack {
                            CardTagView("Cheap")
                        }
                        .environment(\.colorScheme, .light)
                        
                        HStack(spacing: 6) {
                            Group {
                                Text("Open").foregroundColor(.green).fontWeight(.semibold)
                                Text("until 9:00pm")
                            }
                            .modifier(TextShadowModifier())
                        }
                    }
                    
                    Spacer()
                    
                    VStack {
                        Image(systemName: "info.circle.fill")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 26, height: 26)
                            .modifier(TextShadowModifier())
                    }
                }
                .padding()
            }
        }
        .foregroundColor(.white)
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
