import SwiftUI

fileprivate let total: Int = 10
fileprivate let size: CGFloat = 90
fileprivate let imageSize: CGFloat = size - 5

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
    let activeIndex = CGFloat(self.scrollX / size)
    let text = Text(self.dish.name)
      .fontWeight(.bold)
      .lineLimit(1)
      .font(.system(size: 18))
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
          HStack(spacing: 12) {
            Text(self.dish.icon)
              .font(.system(size: 30))

            text
              .shadow(color: Color.black.opacity(0.1), radius: 0, x: 0, y: 1)

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
      .animation(.none)
  }
  
  func getImageXPosition(_ index: Int, activeIndex: Int) -> CGFloat {
    index < activeIndex
      ? self.scrollX - (size * CGFloat(index)) - 140
      : 0
  }
}

struct DishListItemImage: View, Identifiable {
  var id: String { "\(self.dish.id)\(self.index)" }
  var dish: DishItem
  var index: Int
  var activeIndex: CGFloat
  
  func scaleFactor(_ index: Double? = nil, minIndex: CGFloat = 0) -> CGFloat {
    let x0 = activeIndex - 0.5 - CGFloat(index ?? Double(self.index))
    let x1 = min(2, max(minIndex, x0)) // 0 = stage left, 1 = onstage, 2 = stage right
    let x2 = x1 > 0.5 && x1 < 1.5 ? 1 : x1
    return x2
  }

  var scale: CGFloat {
    let s = scaleFactor()
    return 1 + (
      s > 1
        ? ((2 - s) * 0.7)
        : s * 0.7
    )
  }
  
  var opacityScaled: Double {
    let x = min(1, scaleFactor(Double(index) + 1.5))
    return x == 0 ? 1 : Double(0.5 - x)
  }
  
  var isActive: Bool {
    activeIndex == CGFloat(Double(index) + 0.5)
  }
  
  var body: some View {
    // -0.5 = at edge of other cards
    // 0 = starts zooming
    // 0.5 = pops onto stage
    // 1.5 pops off stage
    // 2 = offstage left
    let strength = scaleFactor(Double(index), minIndex: -4.0)
    let isOnStage = strength >= 0.5 && strength <= 1.5
    let sizeScaled = imageSize * scale
    
    if index == 2 {
      print("isOnStage \(isOnStage) scaleFactor \(scaleFactor()) strength \((strength * 10).rounded() / 10) --  \(activeIndex)")
    }
    return self.dish.image
      .resizable()
      .scaledToFill()
      .frame(width: sizeScaled, height: sizeScaled)
      .onGeometryFrameChange { geo in
        if self.isActive {
          App.store.send(.home(.setListItemFocusedDish(
            FocusedDishItem(
              dish: self.dish,
              targetMinY: geo.frame(in: .global).minY
            )
          )))
        }
      }
      .cornerRadiusSquircle(18)
      .shadow(radius: 4)
      .opacity(opacityScaled)
      .rotation3DEffect(.degrees(Double(1 - self.scale) * -5), axis: (0, 1, 0))
      .animation(
        .interpolatingSpring(mass: 1, stiffness: 300, damping: 12, initialVelocity: 0)
      )
      .position(
        x: 0,// self.activeIndex > CGFloat(Double(index) + 0.5) ? -40 : 0,
        y: size / 2
      )
      .zIndex(
        isOnStage ? 100 :
          Double(strength)
      )
  }
}
