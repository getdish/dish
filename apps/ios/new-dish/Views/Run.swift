import SwiftUI
import Combine

struct Run: View {
    let debounce: Double
    let throttle: Double
    let block: () -> Void
    @State var lastRun: AnyCancellable? = nil
    @State var lastRunAt: NSDate = NSDate()
    
    init(debounce: Double = 0, throttle: Double = 0, block: @escaping () -> Void) {
        self.debounce = debounce
        self.throttle = throttle
        self.block = block
    }
    
    func cancelLastRun() {
        if let lr = lastRun { lr.cancel() }
    }
    
    var body: some View {
        if throttle > 0 {
            if abs(lastRunAt.timeIntervalSinceNow) * 1000 >= throttle {
                self.block()
                async {                
                    self.lastRunAt = NSDate()
                }
            }
        } else {
            // debounce / regular
            cancelLastRun()
            var cancelled = 1
            async(debounce) {
                if cancelled > 1 { return }
                self.block()
            }
            async {
                self.lastRun = AnyCancellable {
                    cancelled += 1
                }
            }
        }
        
        return AnyView(EmptyView())
            .onDisappear {
                self.cancelLastRun()
        }
    }
}
