import SwiftUI

struct ScrollListener: View {
    var onScroll: ((CGRect) -> Void)? = nil
    var body: some View {
        Color.clear
            .frame(height: 0)
            .overlay(
                GeometryReader { geometry -> Color in
                    if let cb = self.onScroll {
                        cb(geometry.frame(in: .global))
                    }
                    return Color.clear
                }
        )
    }
}
