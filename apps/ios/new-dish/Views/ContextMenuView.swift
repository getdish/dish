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
        let activeItem = store.activeItem
        
        return ZStack {
            self.content
            
            if activeItem != nil {
                Color.black.opacity(0.5)
                ContextMenuOpenView(item: activeItem!)
            }
        }
        .edgesIgnoringSafeArea(.all)
        .environmentObject(store)
    }
}

struct ContextMenuOpenView: View {
    let item: ContextMenuStore
    
    func getMenuBoundingBox() -> CGRect {
        let contentPos = item.contentPosition        
        let spaceAbove = contentPos.minY
        let spaceBelow = Screen.height - contentPos.maxY
        let isAbove = spaceAbove > spaceBelow
        let height = max(spaceAbove, spaceBelow) - 20
        let width = Screen.width - 40
        if isAbove {
            return CGRect(x: 20, y: 20, width: width, height: height)
        } else {
            return CGRect(x: 20, y: contentPos.maxY + 20, width: width, height: height)
        }
    }
    
    var body: some View {
        let pos = item.contentPosition
        let bb = getMenuBoundingBox()
        return ZStack {
            HStack {
                VStack {
                    item.content.offset(x: pos.minX, y: pos.minY)
                    Spacer()
                }
                Spacer()
            }
            
            VStack {
                item.menuContent
            }
            .offset(x: bb.minX, y: bb.minY)
            .frame(width: bb.width, height: bb.height)
            .background(Color.white)
            .cornerRadius(20)
        }
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
    var content: AnyView = AnyView(Spacer())
    var menuContent: AnyView = AnyView(Spacer())
    var contentPosition = CGRect()
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
        self.store.menuContent = AnyView(self.menuContent)
    }
    
    var body: some View {
        let state = self.store.state
        
        return ZStack {
            self.content
                .background(
                    GeometryReader { geometry -> Color in
                        DispatchQueue.main.async {
                            self.store.contentPosition = geometry.frame(in: .global)
                        }
                        return Color.clear
                    }
                )
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
