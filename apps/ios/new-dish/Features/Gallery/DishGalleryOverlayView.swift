import SwiftUI

struct DishGalleryOverlayView: View {
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        VStack {
            Spacer()
            Button(action: {
                self.store.send(.closeGallery)
            }) {
                HStack {
                    Image(systemName: "xmark")
                        .imageScale(.large)
                        .foregroundColor(.white)
                }
                .frameFlex()
            }
            .background(
                LinearGradient(
                    gradient: Gradient(colors: [Color("brandBackground").opacity(0.1),
                                                Color("brandBackgroundDarker").opacity(0.2)]),
                    startPoint: .top,
                    endPoint: .bottom
                )
            )
                .frame(width: 60, height: 60, alignment: .trailing)
                .cornerRadius(80)
                .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 8)
                .overlay(
                    RoundedRectangle(cornerRadius: 80)
                        .stroke(Color.white.opacity(0.5), lineWidth: 1)
            )
                .opacity(self.store.state.galleryDish == nil ? 0.0 : 1.0)
                .animation(Animation.spring(response: 0.3).delay(0.15))
        }
        .padding(.bottom, 30)
    }
}
