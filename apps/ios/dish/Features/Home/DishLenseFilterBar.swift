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
                    DishLenseButton(lense: self.lenses[index], index: index)
                }
            }
            .padding(.horizontal, 20 - 3)
            .padding(.bottom, 8)
            .padding(.top, 12)
        }
    }
}

struct DishLenseButton: View, Identifiable {
    @EnvironmentObject var store: AppStore
    var id: String { self.lense.id }
    var lense: LenseItem
    var index: Int
    
    var body: some View {
        DishButton(action: {
            self.store.send(.home(.setLenseActive(self.index)))
            if self.store.state.home.drawerPosition == .middle {
                self.store.send(.home(.setDrawerPosition(.bottom)))
            }
        }) {
            HStack {
                Text("\(self.lense.icon)\(self.lense.name != "" ? " \(self.lense.name)" : "")")
                    .font(.system(size: 17))
            }
            .modifier(
                TopNavButtonStyle(
                    active: self.index == self.store.state.home.lenseActive,
                    background: .init(red: lense.rgb[0], green: lense.rgb[1], blue: lense.rgb[2]),
                    height: 38
                )
            )
        }
    }
}
