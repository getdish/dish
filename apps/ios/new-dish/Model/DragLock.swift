struct HomeDragLock {
    enum Lock {
        case idle, off, pager, searchbar
    }

    static var lock: Lock = .idle
    
    static func setLock(_ lock: Lock) {
        HomeDragLock.lock = lock
    }
}
