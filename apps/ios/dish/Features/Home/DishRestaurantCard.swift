import SwiftUI

struct DishRestaurantCard: View, Identifiable {
    @ObservedObject var restaurant: RestaurantItem
    var id: String { restaurant.id }
    var aspectRatio: CGFloat = 2 / 2
    var isMini: Bool = false
    var at: MagicItemPosition = .start
    
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
        MagicItem("restaurant-\(id)", at: at) {
            ZStack {
                self.restaurant.image
                    .resizable()
                    .aspectRatio(self.aspectRatio, contentMode: .fit)
                    .overlay(
                        Rectangle().fill(self.gradientBottom)
                )
                    .overlay(
                        self.textOverlay
                )
                    .cornerRadius(16)
                    .clipped()
                    .shadow(color: Color.black.opacity(0.4), radius: 14, x: 0, y: 3)
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
            .padding(isMini ? 4 : 16)
            
            
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
