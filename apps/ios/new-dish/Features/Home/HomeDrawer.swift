import SwiftUI
import Combine

struct HomeDrawer: View {
    @State var showDrawer = true
    
    var body: some View {
        ZStack {
            // Dark background when open
            Rectangle()
                .animation(.spring())
                .foregroundColor(.black)
                .opacity(self.showDrawer ? 0.25 : 0.0)
                .disabled(!self.showDrawer)
                .onTapGesture {
                    self.showDrawer.toggle()
                    Keyboard.hide()
            }
            
            BottomSheetView(
                isOpen: self.$showDrawer,
                maxHeight: Constants.homeInitialDrawerFullHeight,
                snapRatio: 0.1,
                indicator: AnyView(
                    HStack {
                        BarArrow(direction: self.showDrawer ? .down : .up)
                            .padding(.vertical, 10)
                    }
                    .frame(maxWidth: .infinity)
                    .onTapGesture {
                        self.showDrawer.toggle()
                    }
                    .padding(.vertical, 6)
                )
            ) {
                HomeDrawerContent()
            }
        }
    }
}
