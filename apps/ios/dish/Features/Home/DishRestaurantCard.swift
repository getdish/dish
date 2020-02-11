import SwiftUI

struct DishRestaurantCard: View, Identifiable {
    @ObservedObject var restaurant: RestaurantItem
    var id: String { restaurant.id }
    var isMini: Bool = false
    var at: MagicItemPosition = .start
    
    var width: CGFloat? = nil
    var height: CGFloat? = nil
    
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
//        GeometryReader { geo in
            MagicItem("restaurant-\(self.id)", at: self.at) {
                ZStack {
                    VStack {
                        self.restaurant.image
                            .resizable()
                            .scaledToFill()
                    }
                    .frame(width: self.width ?? App.screen.width - 40, height: self.height ?? 200)
//                    .frame(width: geo.size.width, height: max(geo.size.height, 40))
                        .overlay(
                            Rectangle().fill(self.gradientBottom)
                        )
                        .overlay(
                            self.textOverlay
                        )
                        .overlay(
                            self.tapOverlay
                        )
                        .cornerRadius(16)
                        .clipped()
                        .shadow(color: Color.black.opacity(0.4), radius: 9, x: 0, y: 3)
                }
            }
//        }
    }
    
    var tapOverlay: some View {
        Group {
            if isMini {
                Color.black.opacity(0.00001)
                    .onTapGesture {
//                        App.store.send(.home(.))
                    }
            } else {
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
    
    var textOverlay: some View {
        let ratingSize: CGFloat = isMini ? 25 : 45
        return ZStack(alignment: .bottomLeading) {
            VStack(alignment: .leading) {
                ZStack {
                    Circle()
                        .frame(width: ratingSize, height: ratingSize)
                        .modifier(TextShadowModifier())
                    
                    Group {
                        ForEach(0 ..< self.restaurant.stars) { index in
                            Text("⭐️")
                        }
                    }
                        .font(.system(size: ratingSize * 0.525))
                        .foregroundColor(.black)
                }
                
                Spacer()
                
                VStack(alignment: .leading, spacing: 16) {
                    VStack(alignment: .leading) {
                        Text(restaurant.name)
                            .font(.system(size: isMini ? 14 : 22))
                            .bold()
                            .modifier(TextShadowModifier())
                    }
                    
                    if !isMini {
                        HStack(spacing: 12) {
                            HStack(spacing: 6) {
                                Group {
                                    Text("Open")
                                        .font(.system(size: 14))
                                        .foregroundColor(.green).fontWeight(.semibold)
                                    Text("9:00pm")
                                        .font(.system(size: 14))
                                }
                                .modifier(TextShadowModifier())
                            }
                            
                            ScrollView(.horizontal) {
                                HStack {
                                    CardTagView("Cheap")
                                }
                            }
                        }
                        .environment(\.colorScheme, .light)
                    }
                }
                
            }
            .padding(isMini ? 8 : 16)
        }
        .foregroundColor(.white)
        
    }
}

#if DEBUG
struct DishRestaruantCard_Previews: PreviewProvider {
    static var previews: some View {
        DishRestaurantCard(restaurant: restaurants[0])
            .embedInAppEnvironment()
    }
}
#endif
