import SwiftUI

typealias OnChangePage = (_ curPage: Int) -> Void

struct PagerView<Content: View>: View {
    @Binding var currentIndex: Int
    let pageCount: Int
    let content: Content
    var changePageAction: OnChangePage?

    init(pageCount: Int, currentIndex: Binding<Int>, @ViewBuilder content: () -> Content) {
        self.pageCount = pageCount
        self._currentIndex = currentIndex
        self.content = content()
    }

    @GestureState private var translation: CGFloat = 0
    
    func onChangePage(perform action: @escaping OnChangePage) -> Self {
        var copy = self
        copy.changePageAction = action
        return copy
    }

    var body: some View {
        GeometryReader { geometry in
            HStack(spacing: 0) {
                self.content.frame(width: geometry.size.width)
            }
            .frame(width: geometry.size.width, alignment: .leading)
            .offset(x: -CGFloat(self.currentIndex) * geometry.size.width)
            .offset(x: self.translation)
            .animation(.interactiveSpring())
            .gesture(
                DragGesture().updating(self.$translation) { value, state, _ in
                    state = value.translation.width
                }.onEnded { value in
                    let offset = value.translation.width / geometry.size.width
                    let newIndex = (CGFloat(self.currentIndex) - offset).rounded()
                    self.currentIndex = min(max(Int(newIndex), 0), self.pageCount - 1)
                    
                    if let cb = self.changePageAction {
                        cb(Int(self.currentIndex))
                    }
                }
            )
        }
    }
}

struct PagerView_Previews: PreviewProvider {
    static var previews: some View {
        PagerView(
            pageCount: 3,
            currentIndex: .constant(0)
        ) {
            Color.red
        }
    }
}
