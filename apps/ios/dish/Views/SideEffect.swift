import SwiftUI
import Combine

enum LogLevel: Int {
    case off = 0
    case debug = 1
    case info = 2
    case warn = 3
    case error = 4
}

fileprivate let DEBUG_SIDE_EFFECTS: LogLevel = .info

struct SideEffect: View {
    static let None = SideEffect("", level: .off)
    
    let level: LogLevel
    let debounce: Double
    let throttle: Double
    let condition: (() -> Bool)?
    let block: () -> Void
    let name: String
    
    init(_ name: String, level: LogLevel = .info, debounce: Double = 0, throttle: Double = 0, condition: (() -> Bool)? = nil, block: @escaping () -> Void = {}) {
        self.name = name
        self.level = level
        self.condition = condition
        self.debounce = debounce
        self.throttle = throttle
        self.block = block
    }
    
    var body: some View {
        Run(debounce: debounce, throttle: throttle) {
            if let condition = self.condition, condition() == false {
                return
            }
            if self.level.rawValue >= DEBUG_SIDE_EFFECTS.rawValue {
                print(" ⏩ \(self.name)")
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

struct RunOnce: View {
    var block: () -> Void
    @State var hasRunOnce = false
    
    var body: some View {
        Run {
            if self.hasRunOnce { return }
            self.block()
            self.hasRunOnce = true
        }
    }
}
