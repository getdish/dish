import SwiftUI

class InputEvents {
    init() {
        print("adding notification thing")
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(self.keyDown),
            name: UITextView.textDidChangeNotification,
            object: nil
        )
    }
    
    @objc func keyDown(notification: NSNotification) {
        print("got keydown notification... \(notification.object)")
    }
}

