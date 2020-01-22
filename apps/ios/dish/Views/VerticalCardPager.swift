import SwiftUI

struct VerticalCardPager<Content: View>: View {
    @Binding var currentIndex: Int
    let pageCount: Int
    let content: Content
    let height: CGFloat = 580
    
    init(
        pageCount: Int,
        currentIndex: Binding<Int>,
        @ViewBuilder content: @escaping () -> Content
    ) {
        self.pageCount = pageCount
        self._currentIndex = currentIndex
        self.content = content()
    }
    
    @GestureState private var translation: CGFloat = 0
    
    enum Lock { case on, off, none }
    @State var lockedTo: Lock = .none
    
    var body: some View {
        GeometryReader { geometry in
            VStack(alignment: .leading, spacing: 0) {
                self.content
            }
            .frame(height: geometry.size.height, alignment: .leading)
            .background(Color.black.opacity(0.0001))
            .offset(y: -CGFloat(self.currentIndex) * self.height)
            .offset(y: self.translation)
            .animation(.spring(response: 0.4))
            .simultaneousGesture(
                DragGesture(minimumDistance: 10.0).updating(self.$translation) { value, state, _ in
                    let x = value.translation.width
                    let y = value.translation.height
                    
                    DispatchQueue.main.async {
                        if self.lockedTo == .none {
                            if abs(x) < 10 && abs(y) > 10 {
                                self.lockedTo = .on
                            }
                            if abs(x) > 10 && abs(y) < 10 {
                                self.lockedTo = .off
                            }
                        }
                    }
                    
                    if self.lockedTo == .off {
                        state = 0
                    } else {
                        state = value.translation.height
                    }
                }.onEnded { value in
                    let offset = value.translation.height / self.height
                    let newIndex = (CGFloat(self.currentIndex) - offset).rounded()
                    self.currentIndex = min(max(Int(newIndex), 0), self.pageCount - 1)
                    DispatchQueue.main.async {
                        self.lockedTo = .none
                    }
                }
            )
        }
    }
}

