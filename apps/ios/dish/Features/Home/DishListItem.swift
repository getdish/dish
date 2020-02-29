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

            Text(self.dish.name)
              .fontWeight(.bold)
              .lineLimit(2)
              .font(.system(size: 16))
              .shadow(color: Color.black.opacity(0.1), radius: 0, x: 0, y: 1)

            Spacer()

            Spacer()
              .frame(width: self.screen.width - (self.screen.width - 105))
          }
            .padding(.horizontal)

          ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 0) {
              ScrollListener(
                name: "DishListItem",
                onScrollStart: self.onScrollStart,
                onScrollEnd: self.onScrollEnd
              ) { frame in
                async {
                  let x = -frame.minX
                  self.scrollX = x
                  if x <= 0 {
                    App.store.send(.home(.setListItemFocusedDish(nil)))
                  }
                }
              }
              
              Color.clear.introspectScrollView { scrollView in
                let x: UIScrollView = scrollView
                x.clipsToBounds = false
              }
              
              Spacer()
                .frame(width: self.screen.width - 105)

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
      .frame(width: self.screen.width, height: imageSize)
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
  let stageTime = 0.9
  
  var lB: Double {
    1 - stageTime
  }
  
  var uB: Double {
    stageTime
  }
  
  func getStrength(_ index: Double? = nil, minIndex: CGFloat = 0) -> CGFloat {
    let x0 = activeIndex - 0.5 - CGFloat(index ?? Double(self.index))
    return min(2, max(minIndex, x0)) // 0 = stage left, 1 = onstage, 2 = stage right
  }
  
  func scaleFactor(_ index: Double? = nil, minIndex: CGFloat = 0) -> CGFloat {
    let x1 = getStrength(index, minIndex: minIndex)
    let x2 = x1 >= CGFloat(lB) && x1 <= CGFloat(uB) ? 1 : x1
    return x2
  }

  var scale: CGFloat {
    let s = scaleFactor()
    return 1 + (
      s > 1
        ? ((2 - s) * 0.8)
        : s * 0.8
    )
  }
  
  var opacityScaled: Double {
    let x = min(1, scaleFactor(Double(index) + uB + 0.5))
    return max(0.5, x == 0 ? 1 : lB - Double(x))
  }
  
  var isActive: Bool {
    return self.scaleFactor() == 1
  }
  
  var body: some View {
    // -0.5 = at edge of other cards
    // 0 = starts zooming
    // 0.5 = pops onto stage
    // 1.5 pops off stage
    // 2 = offstage left
    let sf = scaleFactor()
    let strength = Double(getStrength(minIndex: -4.0))
    let isOnStage = sf == 1
    let sizeScaled = imageSize * scale
    
    var x: Double = strength > lB ? -20 : -(strength / 5) * 10
    
    if isActive {
      x = x - (uB - strength) * Double(size)
    }
    
    if index == 0 {
      print("isOnStage \(isOnStage) scaleFactor \(scaleFactor()) strength \((strength * 10).rounded() / 10) --  \(activeIndex)")
    }
    return self.dish.image
      .resizable()
      .scaledToFill()
      .frame(width: sizeScaled, height: sizeScaled)
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
      .opacity(opacityScaled)
      .rotation3DEffect(.degrees(Double(1 - self.scale) * -7), axis: (0, 1, 0))
//      .animation(.spring(), value: !self.isActive)
//      .animation(.none, value: self.isActive)
      .position(
        x: CGFloat(x),
        y: size / 2 - 10
      )
      .animation(.none)
      .zIndex(
        isOnStage ? 100 : strength
      )
  }
}
