import SwiftUI

struct DishCardView: View, Identifiable, Equatable {
  static func == (lhs: DishCardView, rhs: DishCardView) -> Bool {
    lhs.id == rhs.id
  }

  @Environment(\.colorScheme) var colorScheme

  enum DisplayCard {
    case small, large
  }

  var action: (() -> Void)? = nil
  var at: MagicItemPosition = .start
  var dish: DishItem
  var display: DisplayCard = .small
  var height: CGFloat? = nil
  var id: Int { dish.id }
  var width: CGFloat? = nil

  var body: some View {
    let radius: CGFloat = self.display == .small ? 18 : 22
    // drawingGroup is removing our shadows... hacky version for now
    let shadow = Color.black.opacity(0.1).cornerRadius(radius)

    return DishButton(
      action: self.action ?? {
        App.store.send(
          .home(.push(HomeStateItem(state: .search(search: self.dish.name))))
        )
      }
    ) {
      self.dish.image
        .resizable()
        .scaledToFill()
        .frame(width: self.width, height: self.height)
        .shadow(color: Color.black.opacity(0.4), radius: 7, x: 0, y: 1)
        .overlay(self.overlay)
        .cornerRadius(radius)
        .background(
          ZStack {
            shadow.offset(y: 3).scaleEffect(1.02)
            shadow.offset(y: 2).scaleEffect(1.01)
            shadow.offset(y: 1)
          }
        )
        .overlay(
          VStack {
            HStack {
              Text(self.dish.icon)
                .font(.system(size: 32))
                .shadow(color: Color.black.opacity(0.5), radius: 2, y: 1)
                .position(x: 8, y: 8)
              Spacer()
            }
            Spacer()
          }
        )
    }
  }

  var overlay: some View {
    ZStack(alignment: .center) {
      Rectangle().fill(
        LinearGradient(
          gradient: Gradient(
            colors:
              colorScheme == .dark
              ? [Color.black.opacity(0.3), Color.black.opacity(0.6)]
                : [Color.black.opacity(0.2), Color.black.opacity(0.5)]
          ),
          startPoint: .top,
          endPoint: .bottom
        )
      )
      VStack {
        Text(self.dish.name)
          .font(.system(size: self.dish.name.count > 8 ? 14 : 16))
          .fontWeight(.semibold)
          .lineLimit(2)
          .multilineTextAlignment(.center)
          .shadow(color: Color.black.opacity(0.6), radius: 2, x: 0, y: 1)
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
    DishButton(
      action: self.action ?? {
        App.store.send(
          .home(.push(HomeStateItem(state: .search(search: self.dish.name))))
        )
      }
    ) {
      VStack {
        HStack {
          Text(self.dish.name)
            .font(.system(size: 14))
            .fontWeight(.medium)
            .foregroundColor(Color.white)
            .multilineTextAlignment(.center)
            .lineLimit(1)
            .shadow(color: Color.black.opacity(0.25), radius: 0, x: 0, y: 1)
        }
          .padding(.vertical, 8)
          .padding(.horizontal, 13)
          .background(Color.init(hue: self.dish.hue, saturation: 0.8, brightness: 0.5))
          .cornerRadiusSquircle(12)
          .shadow(color: Color.black.opacity(0.5), radius: 5, x: 0, y: 2)
      }
        .padding(4)
    }
    //        }
  }
}
