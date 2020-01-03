struct HomeDragLock {
    enum State {
        case idle, off, pager, searchbar
    }

    static var state: State = .idle
    
    static func setLock(_ lock: State) {
        HomeDragLock.state = lock
    }
}
