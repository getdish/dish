import Foundation

// small async helper
// todo - cancel
func async(
    _ delay: Double = 0,
    interval: Double = 0,
    intervalMax: Double = Double.infinity,
    queue: DispatchQueue = DispatchQueue.main,
    execute: @escaping () -> Void
) {
    var run = execute
    if interval > 0 {
        run = {
            var i = 0.0
            Timer.scheduledTimer(withTimeInterval: interval / 1000, repeats: true) { timer in
                i += 1
                if i > intervalMax { return }
                execute()
            }
        }
    }
    if delay > 0 {
        queue.asyncAfter(deadline: .now() + .milliseconds(Int(delay))) { run() }
    } else {
        queue.async { run() }
    }
}
