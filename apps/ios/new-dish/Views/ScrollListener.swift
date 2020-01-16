import SwiftUI

struct ScrollListener: View {
    var onScroll: ((CGRect) -> Void)? = nil
    var body: some View {
        Color.clear
            .frame(height: 0)
            .overlay(
                GeometryReader { geometry in
                    Run {
                        if let cb = self.onScroll {
                            cb(geometry.frame(in: .global))
                        }
                    }
                }
        )
    }
}
