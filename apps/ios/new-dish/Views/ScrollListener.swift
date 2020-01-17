import SwiftUI

struct ScrollListener: View {
    var onScroll: ((CGRect) -> Void)? = nil
    var body: some View {
        Color.clear
            .frame(height: 0)
            .overlay(
                GeometryReader { geometry -> Run in
                    let frame = geometry.frame(in: .global)
                    return Run {
                        if let cb = self.onScroll {
                            cb(frame)
                        }
                    }
                }
        )
    }
}
