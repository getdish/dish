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
    
    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    var body: some View {
        ZStack {
            self.content
            ContextMenuDisplay(item: store.activeItem)
        }
        .edgesIgnoringSafeArea(.all)
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
    var content: AnyView = AnyView(Spacer())
    var menuContent: AnyView = AnyView(Spacer())
    var contentPosition = CGRect()
}

fileprivate let defaultContextStore = ContextMenuStore()

class ContextMenuOpenStore: ObservableObject {
    @Published var item = defaultContextStore
    
    func open(_ item: ContextMenuStore) {
        print("opening \(item)")
        withAnimation {
            self.item = item
        }
    }
    
    func close() {
        print("closing...")
        self.item.state = .closed
        withAnimation {
            self.item = defaultContextStore
        }
    }
}

struct ContextMenuDisplay: View {
    @ObservedObject var store: ContextMenuOpenStore
    @State var menuFrame = CGRect()
    
    init(item: ContextMenuStore?) {
        let store = ContextMenuOpenStore()
        self.store = store
        
        if let i = item {
            DispatchQueue.main.async {
                store.open(i)
            }
        }
    }
    
    func getMenuBoundingBox() -> CGRect {
        let edgePad: CGFloat = 20
        let contentPos = self.store.item.contentPosition
        let spaceAbove = contentPos.minY
        let spaceBelow = Screen.height - contentPos.maxY
        let isAbove = spaceAbove > spaceBelow
        let height = max(spaceAbove, spaceBelow) - edgePad * 2
        let width = Screen.width - edgePad * 2
        if isAbove {
            let menuHeight = menuFrame.maxY - menuFrame.minY
            let buttonMinY = contentPos.minY
            let y = buttonMinY - menuHeight - 20
            return CGRect(x: 20, y: y, width: width, height: height)
        } else {
            return CGRect(x: 20, y: contentPos.maxY + 20, width: width, height: height)
        }
    }
    
    var body: some View {
        let item = self.store.item
        let pos = item.contentPosition
        let bb = getMenuBoundingBox()
        let isActive = item != defaultContextStore
        
        return ZStack {
            if isActive {
                Color.black
                    .opacity(0.5)
                    .transition(.opacity)
                    .onTapGesture {
                        self.store.close()
                    }
            }

            HStack {
                VStack {
                    if isActive {
                        item.content
                            .offset(x: pos.minX, y: pos.minY)
                            .transition(.opacity)
                    }
                    Spacer()
                }
                Spacer()
            }
            
            item.menuContent.opacity(0)
                .background(
                    GeometryReader { geometry -> Color in
                        DispatchQueue.main.async {
                            self.menuFrame = geometry.frame(in: .global)
                        }
                        return Color.clear
                    }
                )
            
            HStack {
                VStack {
                    if isActive {
                        VStack {
                            item.menuContent
                        }
                        .frame(width: bb.width, height: min(bb.height, self.menuFrame.height))
                        .background(BlurView(style: .systemChromeMaterial))
                        .background(Color.white.opacity(0.1))
                        .cornerRadius(20)
                        .offset(x: bb.minX, y: bb.minY)
                        .transition(AnyTransition.scale.combined(with: .opacity))
                    }
                    Spacer()
                }
                Spacer()
            }
        }
    }
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
            Button(action: {
                // for some reason this never runs, neither onTapGesture
            }) {
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
        }
        .overlay(
            // only way i can get taps working here
            Color.black.opacity(0.0001).onTapGesture {
                print("tap tap \(state)")
                self.store.state = state == .closed ? .open : .closed
                if self.store.state != .closed {
                    self.parentStore.setActive(self.store)
                }
            }
        )
        .onDisappear {
            self.parentStore.setInactive(self.store)
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
