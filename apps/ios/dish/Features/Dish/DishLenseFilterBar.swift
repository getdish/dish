import SwiftUI

struct DishLenseFilterBar: View {
  @EnvironmentObject var store: AppStore

  var lenses: [LenseItem] {
    self.store.state.home.lenses
  }

  var body: some View {
    ScrollView(.horizontal, showsIndicators: false) {
      HStack(spacing: 6) {
        ForEach(0..<self.lenses.count - 1) { index in
          DishLenseButton(
            active: index == self.store.state.home.lenseActive,
            lense: self.lenses[index],
            index: index
          )
            .equatable()
        }
      }
        .padding(.horizontal, 20 - 3)
        .padding(.bottom, 8)
        .padding(.top, 12)
    }
    .offset(y: self.store.state.home.drawerPosition == .bottom && self.store.state.home.focusedItem != nil ? 40 : 0)
    .animation(.spring())
  }
}

struct DishLenseButton: View, Identifiable, Equatable {
  static func == (lhs: DishLenseButton, rhs: DishLenseButton) -> Bool {
    lhs.active == rhs.active && lhs.index == rhs.index && lhs.id == rhs.id
  }

  var active: Bool
  var id: String { self.lense.id }
  var lense: LenseItem
  var index: Int

  var body: some View {
    DishButton(action: {
      App.store.send(.home(.setLenseActive(self.index)))
    }) {
      HStack {
        Text("\(self.lense.icon)\(self.lense.name != "" ? " \(self.lense.name)" : "")")
          .font(.system(size: 17))
      }
        .modifier(
          ControlsButtonStyle(
            active: active,
            background: active ? lense.colorBright : lense.color.opacity(0.6),
            height: 38
          )
        )
        .scaleEffect(active ? 1.1 : 1)
        .shadow(color: lense.color, radius: 2)
        .animation(.spring())
    }
  }
}
