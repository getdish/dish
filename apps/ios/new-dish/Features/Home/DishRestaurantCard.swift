import SwiftUI

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
        ZStack {
            restaurant.image
                .resizable()
                .aspectRatio(aspectRatio, contentMode: .fit)
                .overlay(
                    Rectangle().fill(gradientBottom)
            )
                .overlay(
                    DishRestaurantCardText(
                        restaurant: restaurant,
                        isMini: isMini
                    )
                )
                .cornerRadius(16)
                .clipped()
            
        }
    }
}



struct DishRestaurantCardText: View {
    var restaurant: RestaurantItem
    var isMini: Bool
    
    var body: some View {
        let ratingSize: CGFloat = isMini ? 25 : 45

        return ZStack(alignment: .bottomLeading) {
            VStack(alignment: .leading) {
                ZStack {
                    Circle()
                        .frame(width: ratingSize, height: ratingSize)
                        .modifier(TextShadowModifier())
                    
                    Text("9")
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
            .padding(isMini ? 4 : 12)
            
            
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
        .foregroundColor(.white)
        
    }
}
