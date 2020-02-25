import SwiftUI

struct DishLenseFilterBar: View {
    @EnvironmentObject var store: AppStore
    
    var lenses: [LenseItem] {
        self.store.state.home.lenses
    }
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 6) {
                ForEach(0 ..< self.lenses.count - 1) { index in
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
//            if self.store.state.home.drawerPosition == .middle {
//                self.store.send(.home(.setDrawerPosition(.bottom)))
//            }
        }) {
            HStack {
                Text("\(self.lense.icon)\(self.lense.name != "" ? " \(self.lense.name)" : "")")
                    .font(.system(size: 17))
            }
                .modifier(
                    ControlsButtonStyle(
                        active: active,
                        background: lense.color,
                        height: 38,
                        showBlurBackground: false
                    )
                )
                .animation(.spring())
        }
    }
}
