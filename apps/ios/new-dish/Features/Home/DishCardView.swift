import SwiftUI

struct DishCardView: View, Identifiable {
    enum DisplayCard {
        case card, full, fullscreen
    }
    var id: Int { dish.id }
    var dish: DishItem
    var at: MagicItemPosition = .start
    var display: DisplayCard = .full
    var width: CGFloat? = nil
    var height: CGFloat? = nil
    
    var body: some View {
        let display = self.display
        let dish = self.dish
        
        return MagicItem("\(id)", at: at) {
            GeometryReader { geo in
                dish.image
                    .resizable()
                    .scaledToFill()
                    .frame(width: self.width ?? geo.size.width, height: self.height ?? geo.size.height)
                    .cornerRadius(display == .card ? 14 : 20)
                    .onTapGesture {
                        App.store.send(
                            .home(.push(HomeStateItem(filters: [SearchFilter(name: dish.name)])))
                        )
                }
            }
            .overlay(self.overlay)
        }
        .frame(height: self.height)
    }
    
    var overlay: some View {
        ZStack(alignment: .bottomLeading) {
            Rectangle().fill(
                LinearGradient(
                    gradient: Gradient(colors: [Color.black.opacity(0.6), Color.black.opacity(0)]),
                    startPoint: .bottom,
                    endPoint: .center
                )
            )
            VStack(alignment: .leading) {
                Text(self.dish.name)
                    .font(.system(size: 20))
                    .bold()
                //        Text(dish.park)
            }
            .padding()
        }
        .foregroundColor(.white)
    }
}

