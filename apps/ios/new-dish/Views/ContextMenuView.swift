import SwiftUI

struct ContextMenuView<Content: View, MenuContent: View>: View {
    let content: Content
    let menuContent: MenuContent
    
    enum MenuState {
        case pressing, open, closed
    }
    
    @State var state: MenuState = .closed
    
    init(
        @ViewBuilder menuContent: () -> MenuContent,
                     @ViewBuilder content: () -> Content
    ) {
        self.content = content()
        self.menuContent = menuContent()
    }
    
    var body: some View {
        ZStack {
            if self.state != .closed {
               Color.black.opacity(0.5)
            }
            
            self.content
        }
            .onTapGesture {
                print("tap tap")
                self.state = self.state == .closed ? .open : .closed
        }
            .gesture(
                DragGesture(minimumDistance: 0, coordinateSpace: .local)
                    .onChanged({ value in
                        print("change...")
                        self.state = .pressing
                    }).onEnded({ value in
                        self.state = .closed
                    })
            )
        .overlay(
            self.state == .closed ? nil : ZStack {
                Color.red
                self.menuContent
            }
        )
    }
}
