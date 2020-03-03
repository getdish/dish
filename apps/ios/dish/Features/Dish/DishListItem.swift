import SwiftUI

fileprivate let total: Int = 10
fileprivate let imageSize: CGFloat = 85

struct DishListItem: View, Equatable {
  static func == (lhs: DishListItem, rhs: DishListItem) -> Bool {
    lhs.dish == rhs.dish
  }
  
  @EnvironmentObject var screen: ScreenModel
  
  var dish: DishItem
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
          defaultImagesVisible: 1.5,
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
          onScrollStart: self.onScrollStart,
          onScrollEnd: self.onScrollEnd,
          onScrolledToStart: {
            App.store.send(.home(.setFocusedItem(nil)))
            if let cb = self.onScrollStart {
              cb()
            }
          }
        ) {
          HStack(spacing: 12) {
            Text(self.dish.icon)
              .font(.system(size: 30))
            
            Text(self.dish.name)
              .fontWeight(.bold)
              .lineLimit(2)
              .font(.system(size: 18))
            
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
      .shadow(radius: 3)
      .onGeometryFrameChange { geo in
        if self.isActive {
          let next = HomeFocusedItem(
            dish: self.dish,
            rank: self.index + 1,
            targetMinY: geo.frame(in: .global).minY
          )
          if next != App.store.state.home.focusedItem {
            App.store.send(.home(.setFocusedItem(next)))
          }
        }
      }
  }
}
