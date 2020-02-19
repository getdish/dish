import SwiftUI

struct TopSheetView<Content: View>: View {
    @Binding var isOpen: Bool
    
    let maxHeight: CGFloat
    let minHeight: CGFloat
    let content: Content
    let userIndicator: AnyView?
    let borderRadius: CGFloat = 16
    @GestureState private var translation: CGFloat = 0
    
    init(
        isOpen: Binding<Bool>,
        maxHeight: CGFloat,
        minHeight: CGFloat? = nil,
        indicator: AnyView? = nil,
        @ViewBuilder content: () -> Content
    ) {
        self.minHeight = minHeight ?? maxHeight * 0.2
        self.maxHeight = maxHeight
        self.userIndicator = indicator
        self.content = content()
        self._isOpen = isOpen
    }
    
    private var offset: CGFloat {
        isOpen ? maxHeight : minHeight
    }
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                self.content
            }
            .frame(width: geometry.size.width, height: self.maxHeight, alignment: .bottom)
            .cornerRadius(self.borderRadius)
            .frame(height: geometry.size.height, alignment: .top)
            .shadow(color: Color.black.opacity(0.4), radius: 20, x: 0, y: 5)
            .offset(y: -self.maxHeight + max(self.offset + self.translation, 0))
            .animation(self.translation == 0 ? .spring() : .none)
            .gesture(
                DragGesture().updating(self.$translation) { value, state, _ in
                    state = value.translation.height
                }.onEnded { value in
                    let snapDistance = self.minHeight * 1.5
                    guard abs(value.translation.height) > snapDistance else {
                        return
                    }
                    self.isOpen = value.translation.height < 0
                }
            )
        }
    }
}

struct TopSheetView_Previews: PreviewProvider {
    static var previews: some View {
        TopSheetView(
            isOpen: .constant(false),
            maxHeight: 600,
            minHeight: 100
        ) {
            Color.red
        }.edgesIgnoringSafeArea(.all)
    }
}
