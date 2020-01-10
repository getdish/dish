import Combine

class HomeDragLock: ObservableObject {
    enum State {
        case idle, off, pager, searchbar
    }

    @Published var state: State = .idle
    
    func setLock(_ lock: State) {
        self.state = lock
    }
}
