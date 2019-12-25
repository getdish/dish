import SwiftUI

struct HomeSearchResults: View {
    var state: HomeState
    let items = restaurants
    
    var body: some View {
        ZStack {
            Color.black

            ScrollView(.vertical, showsIndicators: false) {
                VStack {
                    // space below searchbar
                    Spacer().frame(height: 20)

                    ForEach(items) { item in
                        DishRestaurantCard(restaurant: item)
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

    var body: some View {
        ZStack {
            restaurant.image
                .resizable()
                .aspectRatio(2 / 2.25, contentMode: .fit)
                .overlay(RestaurantText(name: "Miss Siagon"))
                .cornerRadius(14)
            
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
                            .font(.system(size: 24))
                            .bold()
                            .modifier(TextShadowModifier())
                    }
                    
                    Spacer()
                    
                    VStack {
                        VStack {
                            Text("9")
                                .font(.system(size: 34))
                                .bold()
                                .foregroundColor(.blue)
                        }
                        .frame(width: 40, height: 40)
                        .background(Color.white)
                        .cornerRadius(100)
                    }
                }
                .padding()
            }
            
            ZStack(alignment: .bottomLeading) {
                Rectangle().fill(gradientBottom)
                
                HStack {
                    VStack(alignment: .leading, spacing: 16) {
                        HStack {
                            TagView { Text("Cheap") }
                        }
                        
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
                        Image(systemName: "phone.fill")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 32, height: 32)
                            .modifier(TextShadowModifier())
                    }
                }
                .padding()
            }
        }
        .foregroundColor(.white)
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
        HomeSearchResults(state: HomeState(dish: "Pho"))
            .embedInAppEnvironment()
    }
}
#endif
