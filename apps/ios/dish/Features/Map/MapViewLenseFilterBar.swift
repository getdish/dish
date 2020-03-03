import SwiftUI

struct MapViewLenseFilterBar: View {
  @EnvironmentObject var store: AppStore

  var lenses: [LenseItem] {
    self.store.state.home.lenses
  }

  var body: some View {
    ScrollView(.horizontal, showsIndicators: false) {
      HStack(spacing: 6) {
        ForEach(0..<self.lenses.count - 1) { index in
          MapLenseButton(
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
    .offset(y: self.store.state.home.drawerPosition == .bottom && self.store.state.home.focusedItem != nil ? 30 : 0)
    .animation(.spring())
  }
}

struct MapLenseButton: View, Identifiable, Equatable {
  static func == (lhs: Self, rhs: Self) -> Bool {
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
            background: active ? lense.colorBright : lense.color.opacity(0.3),
            height: 38
          )
        )
        .scaleEffect(active ? 1.1 : 1)
        .shadow(color: Color.black.opacity(0.5), radius: 2, y: 2)
        .animation(.spring(response: 0.35))
    }
  }
}
