import SwiftUI

struct CustomButton<Content: View>: View {
    let action: () -> Void
    let content: Content
    
    init(_ action: @escaping () -> Void, @ViewBuilder content: () -> Content) {
        self.action = action
        self.content = content()
    }
    
    @State var isTapped = false
    @State var lastTap = Date()
    
    var body: some View {
        self.content
            .animation(.spring())
            .opacity(self.isTapped ? 0.5 : 1)
            .onTapGesture {
                self.lastTap = Date()
                self.action()
            }
            .onLongPressGesture(minimumDuration: 10000, pressing: { isPressing in
                self.isTapped = isPressing
            }) {
                if self.lastTap.timeIntervalSinceNow > 10 {
                    self.action()
                }
            }
    }
}

// hacky for now testing
struct CustomButton2<Content: View>: View {
    let action: () -> Void
    let content: Content
    
    init(_ action: @escaping () -> Void, @ViewBuilder content: () -> Content) {
        self.action = action
        self.content = content()
    }
    
    @State var isTapped = false
    @State var lastTap = Date()
    
    var body: some View {
        self.content
            .animation(.spring())
            .scaleEffect(self.isTapped ? 0.9 : 1)
            .opacity(self.isTapped ? 0.9 : 1)
            .onTapGesture {
                self.lastTap = Date()
                self.action()
        }
        .onLongPressGesture(minimumDuration: 10000, pressing: { isPressing in
            self.isTapped = isPressing
        }) {
            if self.lastTap.timeIntervalSinceNow > 10 {
                self.action()
            }
        }
    }
}
