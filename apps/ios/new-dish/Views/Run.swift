import SwiftUI
import Combine

struct Run: View {
    let debounce: Double
    let block: () -> Void
    @State var lastRun: AnyCancellable? = nil
    
    init(debounce: Double = 0, block: @escaping () -> Void) {
        self.debounce = debounce
        self.block = block
    }
    
    func cancelLastRun() {
        if let lr = lastRun { lr.cancel() }
    }
    
    var body: some View {
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
        return AnyView(EmptyView())
            .onDisappear {
                self.cancelLastRun()
        }
    }
}
