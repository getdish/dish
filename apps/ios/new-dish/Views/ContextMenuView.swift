import SwiftUI
import Combine

class ContextMenuParentStore: ObservableObject {
    @Published var items: [ContextMenuStore] = []
    var cancel: AnyCancellable?
    
    init() {
        self.cancel = self.$items
            .map { store in
                print("got a context store! \(store)")
            }.sink {}
    }
    
    func addItem(_ item: ContextMenuStore) {
        self.items.append(item)
    }
    
    func removeItem(_ item: ContextMenuStore) {
        self.items.removeAll(where: { $0 == item })
    }
}

struct ContextMenuRootView<Content: View>: View {
    let content: Content
    let contextMenuParentStore = ContextMenuParentStore()
    
    init(
        @ViewBuilder content: () -> Content
    ) {
        self.content = content()
    }
    
    var body: some View {
        ZStack {
            self.content
        }
        .environmentObject(contextMenuParentStore)
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
}

struct ContextMenuView<Content: View, MenuContent: View>: View {
    let content: Content
    let menuContent: MenuContent
    
    @EnvironmentObject var contextMenuParentStore: ContextMenuParentStore
    @ObservedObject var store = ContextMenuStore()
    
    init(
        @ViewBuilder menuContent: () -> MenuContent,
                     @ViewBuilder content: () -> Content
    ) {
        self.content = content()
        self.menuContent = menuContent()
    }
    
    var body: some View {
        let state = self.store.state
        
        return ZStack {
            self.content
        }
        .onAppear {
            self.contextMenuParentStore.addItem(self.store)
        }
        .onDisappear {
            self.contextMenuParentStore.removeItem(self.store)
        }
        .onTapGesture {
            print("tap tap")
            self.store.state = state == .closed ? .open : .closed
        }
        .gesture(
            DragGesture(minimumDistance: 0, coordinateSpace: .local)
                .onChanged({ value in
                    print("change...")
                    self.store.state = .pressing
                }).onEnded({ value in
                    self.store.state = .closed
                })
        )
            .overlay(
                state == .closed ? nil : ZStack {
                    Color.red
                    self.menuContent
                }
        )
    }
}
