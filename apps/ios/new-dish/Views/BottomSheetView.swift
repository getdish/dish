import SwiftUI

fileprivate enum Constants {
    static let radius: CGFloat = 16
    static let indicatorHeight: CGFloat = 6
    static let indicatorWidth: CGFloat = 60
    static let minHeightRatio: CGFloat = 0.3
}

struct BottomSheetView<Content: View>: View {
    @Binding var isOpen: Bool
    
    let snapRatio: CGFloat
    let maxHeight: CGFloat
    let minHeight: CGFloat
    let content: Content
    let userIndicator: AnyView?
    
    private var indicator: AnyView {
        if userIndicator != nil {
            return userIndicator!
        } else {
            return AnyView(
                RoundedRectangle(cornerRadius: Constants.radius)
                    .fill(Color.secondary)
                    .frame(
                        width: Constants.indicatorWidth,
                        height: Constants.indicatorHeight
                )
                    .padding()
            )
        }
    }
    
    @GestureState private var translation: CGFloat = 0
    
    private var offset: CGFloat {
        isOpen ? 0 : maxHeight - minHeight
    }
    
    init(
        isOpen: Binding<Bool>,
        maxHeight: CGFloat,
        snapRatio: CGFloat = 0.25,
        indicator: AnyView? = nil,
        @ViewBuilder content: () -> Content
    ) {
        self.minHeight = maxHeight * Constants.minHeightRatio
        self.maxHeight = maxHeight
        self.snapRatio = snapRatio
        self.userIndicator = indicator
        self.content = content()
        self._isOpen = isOpen
    }
    
    var body: some View {
        GeometryReader { geometry in
            VStack(spacing: 0) {
                self.indicator
                self.content
            }
            .frame(width: geometry.size.width, height: self.maxHeight, alignment: .top)
            .background(Color(.secondarySystemBackground))
            .cornerRadius(Constants.radius)
            .frame(height: geometry.size.height, alignment: .bottom)
            .offset(y: max(self.offset + self.translation, 0))
            .animation(.interactiveSpring())
            .gesture(
                DragGesture().updating(self.$translation) { value, state, _ in
                    state = value.translation.height
                }.onEnded { value in
                    let snapDistance = self.maxHeight * self.snapRatio
                    self.isOpen = value.translation.height < snapDistance
                }
            )
        }
    }
}

struct BottomSheetView_Previews: PreviewProvider {
    static var previews: some View {
        BottomSheetView(
            isOpen: .constant(false),
            maxHeight: 600
        ) {
            Rectangle().fill(Color.red)
        }.edgesIgnoringSafeArea(.all)
    }
}
