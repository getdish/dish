import SwiftUI
import Combine

class ContextMenuParentStore: ObservableObject {
    @Published var activeItem: ContextMenuStore? = nil
    
    func setActive(_ item: ContextMenuStore) {
        if self.activeItem != item {
            self.activeItem = item
        }
    }
    
    func setInactive(_ item: ContextMenuStore) {
        self.activeItem = nil
    }
}

struct ContextMenuRootView<Content: View>: View {
    let content: Content
    @ObservedObject var store = ContextMenuParentStore()
    
    init(
        @ViewBuilder content: () -> Content
    ) {
        self.content = content()
    }
    
    var body: some View {
        ZStack {
            self.content
            
            if store.activeItem != nil {
                Color.blue.opacity(0.5)
                store.activeItem?.menuContent
                store.activeItem?.content
            }
        }
        .environmentObject(store)
    }
}

class ContextMenuStore: ObservableObject, Equatable {
    private let id = UUID()
    static func == (lhs: ContextMenuStore, rhs: ContextMenuStore) -> Bool {
        lhs.id == rhs.id
    }
    
    enum MenuState {
        case pressing, open, closed
    }
    
    @Published var state: MenuState = .closed
    @Published var content: AnyView = AnyView(Spacer())
    @Published var menuContent: AnyView = AnyView(Spacer())
}

struct ContextMenuView<Content: View, MenuContent: View>: View {
    let content: Content
    let menuContent: MenuContent
    
    @EnvironmentObject var parentStore: ContextMenuParentStore
    @ObservedObject var store = ContextMenuStore()
    
    init(
        @ViewBuilder menuContent: () -> MenuContent,
                     @ViewBuilder content: () -> Content
    ) {
        self.content = content()
        self.menuContent = menuContent()
        self.store.content = AnyView(self.content)
        self.store.menuContent = AnyView(self.content)
    }
    
    var body: some View {
        let state = self.store.state
        
        return ZStack {
            self.content
        }
        .onDisappear {
            self.parentStore.setInactive(self.store)
        }
        .onTapGesture {
            print("tap tap")
            self.store.state = state == .closed ? .open : .closed
            if self.store.state != .closed {
                self.parentStore.setActive(self.store)
            }
        }
        .gesture(
            DragGesture(minimumDistance: 0, coordinateSpace: .local)
                .onChanged({ value in
                    self.store.state = .pressing
                    self.parentStore.setActive(self.store)
                }).onEnded({ value in
                    self.store.state = .closed
                    self.parentStore.setInactive(self.store)
                })
        )
    }
}
