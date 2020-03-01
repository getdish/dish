import SwiftUI

fileprivate enum SideDrawerViewConstants {
  static let invisibleDragginAreaWidth: CGFloat = 16
  static let snapRatio: CGFloat = 0.25
}

struct SizePreferenceKey: PreferenceKey {
  static var defaultValue: CGSize = .zero

  static func reduce(value: inout CGSize, nextValue: () -> CGSize) {
    value = nextValue()
  }
}

struct SizeView: View {
  var body: some View {
    GeometryReader { geometry in
      Color.clear.preference(key: SizePreferenceKey.self, value: geometry.size)
    }
  }
}

struct SideDrawerView<Content: View, Drawer: View>: View {
  @Binding var isOpen: Bool

  let content: Content
  let drawer: Drawer

  @State private var drawerSize: CGSize = .zero
  @GestureState private var translation: CGFloat = 0

  private var dragGesture: some Gesture {
    DragGesture(minimumDistance: 0).updating(self.$translation) { value, state, _ in
      state = value.translation.width
    }.onEnded { value in
      let snapDistance = self.drawerSize.width * SideDrawerViewConstants.snapRatio
      guard abs(value.translation.width) > snapDistance else {
        return
      }
      self.isOpen = value.translation.width > 0
    }
  }

  private var offset: CGFloat {
    var offset = isOpen ? 0 : -drawerSize.width
    offset += translation
    return max(min(offset, 0), -drawerSize.width)
  }

  init(
    isOpen: Binding<Bool>, @ViewBuilder content: () -> Content, @ViewBuilder drawer: () -> Drawer
  ) {
    self._isOpen = isOpen
    self.content = content()
    self.drawer = drawer()
  }

  var body: some View {
    ZStack(alignment: .leading) {
      self.content
      HStack(spacing: 0) {
        self.drawer.background(SizeView())
        Color.clear
          .frame(width: SideDrawerViewConstants.invisibleDragginAreaWidth)
      }
        .onPreferenceChange(SizePreferenceKey.self) { self.drawerSize = $0 }
        .offset(x: offset)
        .animation(.interactiveSpring())
        .gesture(self.dragGesture)
    }
  }
}

struct SideDrawerView_Previews: PreviewProvider {
  static var previews: some View {
    struct PreviewView: View {
      @State private var sideDrawerShown = true

      var body: some View {
        SideDrawerView(
          isOpen: self.$sideDrawerShown,
          content: { Color.blue },
          drawer: { Color.red.frame(width: 300) }
        )
      }
    }
    return PreviewView()
  }
}
