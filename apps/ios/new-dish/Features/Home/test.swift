import SwiftUI


#if DEBUG
struct Test2_Previews: PreviewProvider {
    static var previews: some View {
        ZStack {
            Color.red

            LinearGradient(
                gradient: .init(colors: [
                    Color.white.opacity(0),
                    Color.black
                ]),
                startPoint: .top,
                endPoint: .bottom
            )
        }
    }
}
#endif
