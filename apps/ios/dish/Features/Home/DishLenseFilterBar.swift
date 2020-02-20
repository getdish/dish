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
            App.store.send(.home(.setLenseActive(self.index)))
        }) {
            HStack {
                Text("\(self.lense.icon)\(self.lense.name != "" ? " \(self.lense.name)" : "")")
                    .font(.system(size: 17))
            }
            .modifier(
                TopNavButtonStyle(
                    active: self.index == self.store.state.home.lenseActive,
                    height: 38
                )
            )
        }
    }
}
