import SwiftUI

struct DishLenseFilterBar: View {
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        VStack(spacing: 0) {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 6) {
                    ForEach(0 ..< self.store.state.home.lenses.count - 1) { index in
                        DishButton(action: {
                            self.store.send(.home(.setLenseActive(index)))
                        }) {
                            HStack {
                                Text(self.store.state.home.lenses[index])
                                    .font(.system(size: 17))
                            }
                            .modifier(
                                TopNavButtonStyle(
                                    active: index == self.store.state.home.lenseActive,
                                    height: 38
                                )
                            )
                        }
                    }
                }
                .padding(.horizontal, 20 - 3)
                .padding(.bottom, 8)
                .padding(.top, 12)
            }
        }
    }
}
