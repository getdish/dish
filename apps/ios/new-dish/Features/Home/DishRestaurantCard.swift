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
        let isMini = self.isMini
        let ratingSize: CGFloat = isMini ? 25 : 45
        
        return ZStack {
            restaurant.image
                .resizable()
                .aspectRatio(aspectRatio, contentMode: .fit)
                .cornerRadius(16)
            
            ZStack(alignment: .bottomLeading) {
                Rectangle().fill(gradientBottom)
                
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
                        
                        HStack(spacing: 12) {
                            if !isMini {
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


