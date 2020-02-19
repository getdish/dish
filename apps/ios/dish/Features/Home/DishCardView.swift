import SwiftUI

struct DishCardView: View, Identifiable, Equatable {
    static func == (lhs: DishCardView, rhs: DishCardView) -> Bool {
        lhs.id == rhs.id
    }
    
    @Environment(\.colorScheme) var colorScheme
    
    enum DisplayCard {
        case card, full, fullscreen
    }
    var id: Int { dish.id }
    var dish: DishItem
    var at: MagicItemPosition = .start
    var display: DisplayCard = .full
    var width: CGFloat? = nil
    var height: CGFloat? = nil
    var action: (() -> Void)? = nil
    
    var body: some View {
        MagicItem("dish-\(id)", at: at) {
            GeometryReader { geo in
                DishButton(action: self.action ?? {
                    App.store.send(
                        .home(.push(HomeStateItem(dishes: [DishFilterItem(name: self.dish.name)])))
                    )
                }) {
                    self.dish.image
                        .resizable()
                        .scaledToFill()
                        .frame(width: self.width ?? geo.size.width, height: self.height ?? geo.size.height)
                        .overlay(self.overlay)
                        .cornerRadius(self.display == .card ? 12 : 24)
                        .clipped()
                        .shadow(color: Color.black.opacity(0.5), radius: 6, x: 0, y: 2)
                }
            }
        }
        .frame(height: self.height)
    }
    
    var overlay: some View {
        ZStack(alignment: .center) {
            Rectangle().fill(
                LinearGradient(
                    gradient: Gradient(colors:
                        colorScheme == .dark
                         ? [Color.black.opacity(0.6), Color.black.opacity(0.4)]
                            : [Color.black.opacity(0.4), Color.black.opacity(0.2)]
                    ),
                    startPoint: .bottom,
                    endPoint: .center
                )
            )
            VStack(alignment: .leading) {
                Text(self.dish.name)
                    .font(.system(size: 16))
                    .fontWeight(.bold)
                    .multilineTextAlignment(.center)
                    .lineLimit(1)
                    .shadow(color: Color.black.opacity(0.8), radius: 2, x: 0, y: 1)
            }
            .padding()
        }
        .foregroundColor(.white)
    }
}


struct DishButtonView: View, Identifiable, Equatable {
    static func == (lhs: DishButtonView, rhs: DishButtonView) -> Bool {
        lhs.id == rhs.id
    }
    
    @Environment(\.colorScheme) var colorScheme
    
    var id: Int { dish.id }
    var dish: DishItem
    var at: MagicItemPosition = .start
    var action: (() -> Void)? = nil
    
    var body: some View {
//        MagicItem("dish-button-\(id)", at: at) {
            DishButton(action: self.action ?? {
                App.store.send(
                    .home(.push(HomeStateItem(search: self.dish.name)))
                )
            }) {
                VStack {
                    HStack {
                        Text(self.dish.name)
                            .font(.system(size: 16))
                            .fontWeight(.light)
                            .foregroundColor(Color.white)
                            .multilineTextAlignment(.center)
                            .lineLimit(1)
                            .shadow(color: Color.black.opacity(0.25), radius: 0, x: 0, y: 1)
                    }
                    .padding(.vertical, 7)
                    .padding(.horizontal, 11)
                    .background(Color.init(hue: self.dish.hue, saturation: 0.8, brightness: 0.5))
                    .cornerRadius(20)
                    .shadow(color: Color.black.opacity(0.2), radius: 5, x: 0, y: 2)
                }
                .padding(4)
            }
//        }
    }
}
