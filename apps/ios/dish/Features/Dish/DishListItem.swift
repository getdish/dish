import SwiftUI

fileprivate let total: Int = 10
fileprivate let imageSize: CGFloat = 85

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
    DishButton(
      action: {
        App.store.send(
          .home(.push(HomeStateItem(state: .search(search: self.dish.name))))
        )
    },
      scaleEffect: 1.0
    ) {
        ListItemGallery(
          getImage: { (index, size, isActive) in
            DishListItemRestaurantCard(
              dish: self.dish,
              index: index,
              isActive: isActive,
              size: size
            )
          },
          imageSize: imageSize,
          total: total,
          onScrolledToStart: {
            App.store.send(.home(.setListItemFocusedDish(nil)))
            if let cb = self.onScrollStart {
              cb()
            }
          }
        ) {
          HStack(spacing: 12) {
            Text(self.dish.icon)
              .font(.system(size: 30))
            
            Text(self.dish.name)
              .fontWeight(.regular)
              .lineLimit(2)
              .font(.system(size: 18))
              .shadow(color: Color.black.opacity(0.1), radius: 0, x: 0, y: 1)
            
            Spacer()
          }
      }
      Spacer()
    }
  }
}

struct DishListItemRestaurantCard: View {
  var dish: DishItem
  var index: Int
  var isActive: Bool
  var size: CGFloat
  
  var body: some View {
    self.dish.image
      .resizable()
      .scaledToFill()
      .frame(width: size, height: size)
      .cornerRadiusSquircle(18)
      .overlay(
        VStack {
          Spacer()
          HStack {
            if index == 0 {
              Text("⭐️")
                .offset(x: -4, y: 4)
            }
            Spacer()
          }
        }
      )
      .shadow(radius: 4)
      .onGeometryFrameChange { geo in
        if self.isActive {
          let next = FocusedDishItem(
            dish: self.dish,
            rank: self.index + 1,
            targetMinY: geo.frame(in: .global).minY
          )
          if next != App.store.state.home.listItemFocusedDish {
            App.store.send(.home(.setListItemFocusedDish(next)))
          }
        }
      }
  }
}
