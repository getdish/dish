import SwiftUI

struct DishListItem: View, Equatable {
    static func == (lhs: DishListItem, rhs: DishListItem) -> Bool {
        lhs.dish == rhs.dish
    }
    
    @EnvironmentObject var screen: ScreenModel
    @State var isScrolled: Bool = false
    
    @GestureState private var translationX: CGFloat = 0
    
    var number: Int
    var dish: DishItem
    var body: some View {
        let imageSize: CGFloat = 66 //isScrolled ? 70 : 60
        
        let image = DishButton(action: {}) {
            dish.image
                .resizable()
                .scaledToFill()
                .frame(width: imageSize, height: imageSize)
                .cornerRadiusSquircle(18)
                .animation(.spring())
        }
        
        return ZStack {
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
                        
                        Spacer()
                            .frame(width: self.screen.width - (self.screen.width - 120))
                    }
                        .padding(.horizontal)
                }
                    .frame(width: self.screen.width)
                
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack {
                        Spacer()
                            .frame(width: self.screen.width - 120)
                        
                        HStack {
                            image
                            image
                            image
                            image
                            image
                            image
                            image
                            image
                            image
                            image
                        }
                        .frame(width: 72 * 10)
                    }
                    .padding(.trailing)
                    .offset(x: self.translationX)
                    .drawingGroup()
                }
        }
            .frame(width: self.screen.width, height: imageSize + 10)
            .animation(.spring())
    }
}

