import SwiftUI

struct TopNavCamera: View {
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        let isOnHome = self.store.state.home.view == .home
        
        return HStack {
            Button(action: {
            }) {
                VStack {
                    Text("@ Pancho Villa Taqueria")
                        .fontWeight(.bold)
                }
                .padding(.vertical, 4)
                .padding(.horizontal, 8)
                .background(Color.white.opacity(0.2))
                .cornerRadius(20)
                .onTapGesture {
                    //                                    Store.camera.showRestaurantDrawer.toggle()
                }
            }
            .foregroundColor(.white)
            .offset(y: isOnHome ? -80 : 0)
            .animation(
                Animation.spring().delay(!isOnHome ? 0.25 : 0.0)
            )
            
            Spacer()
        }
    }
}
