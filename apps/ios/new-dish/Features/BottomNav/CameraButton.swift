import SwiftUI

struct CameraButton: View {
    var body: some View {
        Button(action: {
            homePager.animateTo(2)
        }) {
            ZStack {
                Group {
                    Image(systemName: "viewfinder")
                        .resizable()
                        .scaledToFit()
                    
                    Image(systemName: "circle.fill")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 17, height: 17)
                }
                .foregroundColor(.white)
            }
        }
        .padding(.all, 13)
        .background(
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(red: 0.8, green: 0.5, blue: 0.8),
                    Color(red: 0.8 + 0.1, green: 0.5 + 0.1, blue: 0.8 + 0.1)
                ]),
                startPoint: .top,
                endPoint: .bottom
            )
        )
            .cornerRadius(80)
            .frame(width: 58, height: 58)
            .animation(.spring(response: 0.5))
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
            .shadow(color: Color.black.opacity(1), radius: 25, x: 0, y: 6)
    }
}
