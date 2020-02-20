import SwiftUI

struct DishButton<Content: View>: View {
    let action: (() -> Void)?
    let content: Content
    
    init(action: @escaping () -> Void, @ViewBuilder content: () -> Content) {
        self.action = action
        self.content = content()
    }
    
    @State var isTapped = false
    @State var lastTap = Date()
    
    func callbackAction() {
        if let cb = self.action { cb() }
    }
    
    var body: some View {
        self.content
            // ⚠️ dont put .animation() here or every subview animates
            .scaleEffect(self.isTapped ? 0.9 : 1)
            .opacity(self.isTapped ? 0.9 : 1)
            .onTapGesture {
                self.lastTap = Date()
                self.callbackAction()
        }
        .onLongPressGesture(
            minimumDuration: 10000,
            maximumDistance: 8,
            pressing: { isPressing in
            withAnimation(.spring()) {
                self.isTapped = isPressing
            }
            if isPressing {
                self.lastTap = Date()
            } else {
//                self.callbackAction()
            }
        }) {
            if self.lastTap.timeIntervalSinceNow > 10 {
                self.callbackAction()
            }
        }
    }
}
