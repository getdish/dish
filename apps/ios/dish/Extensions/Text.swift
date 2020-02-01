import SwiftUI

extension Text {
    func titleBarStyle() -> some View {
        self
            .font(.system(size: 13))
            .fontWeight(.semibold)
            .shadow(color: Color.black.opacity(0.4), radius: 2, x: 0, y: 1)
    }
}
