import SwiftUI
import Combine

struct HomeDrawer: View {
    @EnvironmentObject var store: AppStore
    
    private var showDrawer: Binding<Bool> {
        store.binding(for: \.showDrawer) { .setShowDrawer($0) }
    }
    
    var body: some View {
        ZStack {
            // Dark background when open
            Color
                .black
                .opacity(store.state.showDrawer ? 0.25 : 0.0)
                .animation(.spring())
                .disabled(!store.state.showDrawer)
                .onTapGesture {
                    self.store.send(.toggleDrawer)
                    Keyboard.hide()
            }
            
            BottomSheetView(
                isOpen: self.showDrawer,
                maxHeight: Constants.homeInitialDrawerFullHeight,
                snapRatio: 0.1,
                indicator: AnyView(
                    HStack {
                        BarArrow(direction: store.state.showDrawer ? .down : .up)
                            .padding(.vertical, 10)
                    }
                    .frame(maxWidth: .infinity)
                    .onTapGesture {
//                        AppAction.toggleDrawer()
                    }
                    .padding(.vertical, 6)
                )
            ) {
                HomeDrawerContent()
            }
        }
    }
}
