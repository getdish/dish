import SwiftUI

struct ScrollListener: View {
    typealias Cb = ((CGRect) -> Void)
    
    let debounce: Double
    let throttle: Double
    var onScroll: Cb?
    
    init(debounce: Double = 0, throttle: Double = 0, onScroll: Cb? = nil) {
        self.debounce = debounce
        self.throttle = throttle
        self.onScroll = onScroll
    }
    
    var body: some View {
        Color.clear
            .frame(height: 0)
            .overlay(
                GeometryReader { geometry -> Run in
                    let frame = geometry.frame(in: .global)
                    return Run("ScrollListener", debounce: self.debounce, throttle: self.throttle) {
                        if let cb = self.onScroll {
                            cb(frame)
                        }
                    }
                }
        )
    }
}
