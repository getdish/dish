import SwiftUI

struct CameraButton: View {
    @State var isTapped = false
    @State var lastTap = Date()
    
    var body: some View {
        ZStack {
            Group {
                Image(systemName: "camera.fill")
                    .resizable()
                    .scaledToFit()
                
                //                    Image(systemName: "circle.fill")
                //                        .resizable()
                //                        .scaledToFit()
                //                        .frame(width: 17, height: 17)
            }
            .foregroundColor(.white)
        }
        .padding(.all, 15)
        .background(
            LinearGradient(
                gradient: Gradient(colors: [
                    Color.white.opacity(0),
                    Color.white.opacity(0.4)
                ]),
                startPoint: .top,
                endPoint: .bottom
            )
        )
        .background(
                RadialGradient(
                    gradient: Gradient(colors: [
                        Color.white.opacity(0),
                        Color.white.opacity(0.8)
                    ]),
                    center: .center,
                    startRadius: 0,
                    endRadius: 80
                )
        )
            .cornerRadius(80)
            .frame(width: 58, height: 58)
            .shadow(color: Color.black.opacity(1), radius: 30, x: 0, y: 3)
            .shadow(color: Color.black.opacity(1), radius: 15, x: 0, y: 0)
            .overlay(
                RoundedRectangle(cornerRadius: 80)
                    .stroke(Color.white.opacity(0.95), lineWidth: 2)
            )
            .overlay(
                VStack {
                    RoundedRectangle(cornerRadius: 80)
                        .stroke(Color.black.opacity(0.24), lineWidth: 2)
                }
                .padding(2)
            )
            .animation(.spring())
            .opacity(self.isTapped ? 0.5 : 1)
            .scaleEffect(self.isTapped ? 0.9 : 1)
            .onTapGesture {
                self.lastTap = Date()
                if !App.store.state.home.showCamera {
                    App.store.send(.home(.setShowCamera(true)))
                } else {
                    App.store.send(.camera(.capture(true)))
                }
            }
            .onLongPressGesture(minimumDuration: 10000, pressing: { isPressing in
                self.isTapped = isPressing
//                self.isTapped = isPressing
//                App.store.send(.home(.setShowCamera(true)))
            }) {
                if self.lastTap.timeIntervalSinceNow > 10 {
                    App.store.send(.home(.setShowCamera(false)))
                }
            }
    }
}

#if DEBUG
struct CameraButton_Previews: PreviewProvider {
    static var previews: some View {
        CameraButton()
    }
}
#endif

//            .mask(
//                Path { path in
//                    let size = 58
//                    let q = 14
//                    path.move(to: CGPoint(x: 0, y: 0))
//                    path.addLine(to: CGPoint(x: 0, y: size))
//                    path.addLine(to: CGPoint(x: size, y: size))
//                    path.addLine(to: CGPoint(x: size, y: 0))
//                    let r = (size - q) / 2
//                    path.addEllipse(in:
//                        CGRect(
//                            x: r,
//                            y: r,
//                            width: q,
//                            height: q
//                        )
//                    )
//                }
//        )
