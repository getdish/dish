import SwiftUI

extension Text {
    func titleBarStyle(_ size: CGFloat = 13) -> some View {
        self
            .font(.system(size: size))
            .fontWeight(.semibold)
            .shadow(color: Color.black.opacity(0.4), radius: 2, x: 0, y: 1)
    }
}
