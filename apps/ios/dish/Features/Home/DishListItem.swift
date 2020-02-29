import SwiftUI

fileprivate let total: Int = 10
fileprivate let size: CGFloat = 72
fileprivate let imageSize: CGFloat = 66

struct DishListItem: View, Equatable {
  static func == (lhs: DishListItem, rhs: DishListItem) -> Bool {
    lhs.dish == rhs.dish
  }

  @EnvironmentObject var screen: ScreenModel

  var dish: DishItem
  var number: Int
  var onScrollStart: (() -> Void)? = nil
  var onScrollEnd: (() -> Void)? = nil
  @State var scrollX: CGFloat = 0
  
  var body: some View {
    let activeIndex = Int(self.scrollX / size)
    return ZStack {
      DishButton(
        action: {
          App.store.send(
            .home(.push(HomeStateItem(state: .search(search: self.dish.name))))
          )
        },
        scaleEffect: 1.0
      ) {
        ZStack {
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

          ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 0) {
              ScrollListener(onScrollStart: self.onScrollStart, onScrollEnd: self.onScrollEnd) { frame in
                async {
                  self.scrollX = -frame.minX
                }
              }
              
              Color.clear.introspectScrollView { scrollView in
                let x: UIScrollView = scrollView
                x.clipsToBounds = false
              }
              
              Spacer()
                .frame(width: self.screen.width - 120)

              HStack {
                ForEach(0..<total) { index in
                  DishListItemImage(dish: self.dish, index: index, activeIndex: activeIndex)
                    .position(
                      x: self.getImageXPosition(index, activeIndex: activeIndex),
                      y: size / 2 + (index < activeIndex ? 90 : 0)
                    )
                }
              }
                .frame(width: size * CGFloat(total))
            }
              .padding(.trailing)
          }
        }
      }
        .frame(width: self.screen.width)
    }
      .frame(width: self.screen.width, height: imageSize + 10)
      .animation(.spring())
  }
  
  func getImageXPosition(_ index: Int, activeIndex: Int) -> CGFloat {
    index < activeIndex
      ? self.scrollX - (size * CGFloat(index)) - 140
      : 0
  }
}

struct DishListItemImage: View, Identifiable {
  var id: Int { self.dish.id }
  var dish: DishItem
  var index: Int
  var activeIndex: Int
  
  @State var isActive = false
  
  var body: some View {
    let next = self.index < self.activeIndex
    if next != self.isActive {
      async {
        withAnimation(.spring()) {
          self.isActive = next
        }
      }
    }
    
    let imgs = self.isActive ? 120 : imageSize
    
    return Color.clear
      .frame(width: imageSize, height: imageSize)
      .overlay(
        self.dish.image
          .resizable()
          .scaledToFill()
          .frame(width: imageSize, height: imageSize)
          .cornerRadiusSquircle(18)
          .shadow(radius: 4)
          .opacity(index + 2 < activeIndex ? 0 : 1)
          .scaleEffect(self.isActive ? 3 : 1)
          .animation(.spring())
    )
  }
}
