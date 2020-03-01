import Combine
import SwiftUI

class ContextMenuParentStore: ObservableObject {
  @Published var item: ContextMenuItemStore? = nil

  func setActive(_ item: ContextMenuItemStore) {
    if self.item != item {
      self.item = item
    }
  }

  func setInactive(_ item: ContextMenuItemStore) {
    self.item = nil
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
      ContextMenuDisplay(parentStore: store)
    }
      .environmentObject(store)
  }
}

class ContextMenuItemStore: ObservableObject, Equatable {
  private let id = UUID()

  static func == (lhs: ContextMenuItemStore, rhs: ContextMenuItemStore) -> Bool {
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

fileprivate let defaultContextStore = ContextMenuItemStore()

struct ContextMenuDisplay: View {
  class ContextMenuDisplayStore: ObservableObject {
    @Published var item = defaultContextStore
    private var parentStore: ContextMenuParentStore

    init(parentStore: ContextMenuParentStore) {
      self.parentStore = parentStore
    }

    func open(_ item: ContextMenuItemStore) {
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
      async(300) {
        self.parentStore.item = nil
      }
    }
  }

  @EnvironmentObject var screen: ScreenModel
  @ObservedObject var store: ContextMenuDisplayStore
  @State var menuFrame = CGRect()

  init(parentStore: ContextMenuParentStore) {
    let store = ContextMenuDisplayStore(
      parentStore: parentStore
    )
    self.store = store
    if let item = parentStore.item {
      DispatchQueue.main.async {
        store.open(item)
      }
    }
  }

  func getMenuBoundingBox() -> CGRect {
    let edgePad: CGFloat = 20
    let contentPos = self.store.item.contentPosition
    let spaceAbove = contentPos.minY
    let spaceBelow = screen.height - contentPos.maxY
    let isAbove = spaceAbove > spaceBelow
    let height = max(spaceAbove, spaceBelow) - edgePad * 2
    let width = screen.width - edgePad * 2
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
          .opacity(0.1)
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
        .overlay(
          GeometryReader { geometry -> Run in
            let frame = geometry.frame(in: .global)
            return Run("ContextMenu.measure") {
              self.menuFrame = frame
            }
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
  @ObservedObject var store = ContextMenuItemStore()

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
      DishButton(action: {
        print("tap")
        // for some reason this never runs, neither onTapGesture
      }) { 
        self.content
          .overlay(
            GeometryReader { geometry -> Run in
              let frame = geometry.frame(in: .global)
              return Run("ContextMenuView.measureContentPosition") {
                self.store.contentPosition = frame
              }
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
