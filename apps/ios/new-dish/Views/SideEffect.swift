import SwiftUI
import Combine

fileprivate let DEBUG_SIDE_EFFECTS = true

struct SideEffect: View {
    let debounce: Double
    let throttle: Double
    let block: () -> Void
    let name: String
    
    init(_ name: String, debounce: Double = 0, throttle: Double = 0, block: @escaping () -> Void = {}) {
        self.name = name
        self.debounce = debounce
        self.throttle = throttle
        self.block = block
    }
    
    var body: some View {
        Run(debounce: debounce, throttle: throttle) {
            if DEBUG_SIDE_EFFECTS {
                print("sideeffect \(self.name)")
            }
            self.block()
        }
    }
}

// prefer this ^ except for extremely-often-running things

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
                async {
                    self.block()
                    self.lastRunAt = NSDate()
                }
            }
        } else if debounce > 0 {
            // debounce
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
        } else {
            async {
                self.block()
            }
        }
        return emptyView.onDisappear { self.cancelLastRun() }
    }
}
