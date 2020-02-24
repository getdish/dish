import SwiftUI

struct DishListItem: View, Equatable {
    static func == (lhs: DishListItem, rhs: DishListItem) -> Bool {
        lhs.dish == rhs.dish
    }
    
    @EnvironmentObject var screen: ScreenModel
    @State var isScrolled: Bool = false
    
    var number: Int
    var dish: DishItem
    var body: some View {
        let imageSize: CGFloat = 60 //isScrolled ? 70 : 60
        
        let image = DishButton(action: {}) {
            dish.image
                .resizable()
                .scaledToFill()
                .frame(width: imageSize, height: imageSize)
                .cornerRadiusSquircle(18)
                .animation(.spring())
        }
        
        return ListItemHScroll(isScrolled: self.$isScrolled) {
            HStack {
                DishButton(action: {
                    App.store.send(
                        .home(.push(HomeStateItem(search: self.dish.name)))
                    )
                }) {
                    HStack {
                        Text("\(self.number).")
                            .font(.system(size: 20))
                            .fontWeight(.bold)
                            .opacity(0.3)
                        
                        Text("\(self.dish.name)")
                            .fontWeight(.light)
                            .lineLimit(1)
                            .font(.system(size: 22))
                        
                        Spacer()
                    }
                    .padding(.horizontal)
                    .frame(width: self.screen.width - 120 - 20)
                }
                
                HStack {
                    image
                    image
                    image
                    image
                }
                .drawingGroup()
                .padding(.trailing)
            }
        }
        .frame(height: imageSize + 10)
        .animation(.spring())
    }
}

