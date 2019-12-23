import SwiftUI
import Combine

typealias OnChangePage = (_ curPage: Int) -> Void

// TODO i'm just using PagerStore as a global (pStore), because @EnvironmentObject gave me
// trouble, i couldn't get it to react inside views for some reason...

func isRoundNumber(_ num: Double) -> Bool {
    return num.truncatingRemainder(dividingBy: 1.0) == 0.0
}

//struct PagerView<Content: View>: View {
//    @Binding var currentIndex: Int
//    let pageCount: Int
//    let content: Content
//    var changePageAction: OnChangePage?
//
//    @GestureState private var translation: CGFloat = 0
//
//    func onChangePage(perform action: @escaping OnChangePage) -> Self {
//        var copy = self
//        copy.changePageAction = action
//        return copy
//    }
//
//    var body: some View {
//        GeometryReader { geometry in
//            HStack(spacing: 0) {
//                self.content.frame(width: geometry.size.width)
//            }
//            .frame(width: geometry.size.width, alignment: .leading)
//            .offset(x: -CGFloat(self.currentIndex) * geometry.size.width)
//            .offset(x: self.translation)
//            .animation(.spring())
//            .gesture(
//                DragGesture().updating(self.$translation) { value, state, _ in
//                    state = value.translation.width
//                }.onEnded { value in
//                    let offset = value.translation.width / geometry.size.width
//                    let newIndex = (CGFloat(self.currentIndex) - offset).rounded()
//                    self.currentIndex = min(max(Int(newIndex), 0), self.pageCount - 1)
//
//                    if let cb = self.changePageAction {
//                        cb(Int(self.currentIndex))
//                    }
//                }
//            )
//        }
//    }
//}

struct PagerView<Content: View>: View {
    @ObservedObject var pagerStore = PagerStore()
    var disableDragging = false
    var pageTurnArrows = false
    var content: Content
    var pageCount: Int
    var changePageAction: OnChangePage?
    
    init(
        pageCount: Int,
        pagerStore: PagerStore,
        disableDragging: Bool = false,
        pageTurnArrows: Bool = false,
        @ViewBuilder content: () -> Content
    ) {
        self.pageCount = pageCount
        self.pagerStore = pagerStore
        self.disableDragging = disableDragging
        self.pageTurnArrows = pageTurnArrows
        self.content = content()
    }
    
    var body: some View {
        GeometryReader { geometry in
            HStack(alignment: .center, spacing: 0) {
                self.content
                    .frame(width: geometry.size.width)
            }
//            .animation(.spring())
            .offset(
                x: self.pagerStore.isGestureActive
                    ? self.pagerStore.offset
                    : -geometry.size.width * CGFloat(self.pagerStore.index)
            )
                .frame(width: geometry.size.width, height: nil, alignment: .leading)
                .overlay(self.overlay)
                .gesture(
                    self.disableDragging ? nil : DragGesture(minimumDistance: 20)
                        .onChanged({ value in
                            print("Pager.onDrag")
                            self.pagerStore.isGestureActive = true
                            self.pagerStore.offset = value.translation.width + -geometry.size.width * CGFloat(self.pagerStore.index)
                        })
                        .onEnded({ value in
                            self.pagerStore.onDragEnd(value)
                            if self.changePageAction != nil {
                                if self.pagerStore.index.truncatingRemainder(dividingBy: 1.0) == 0.0 {
                                    print("on change page \(Int(self.pagerStore.index))")
                                    self.changePageAction!(Int(self.pagerStore.index))
                                }
                            }
                        })
            )
        }
    }
    
    @ViewBuilder
    var overlay: some View {
        if !self.pageTurnArrows {
            return nil
        }
        
        let pageIndex = self.pagerStore.indexRounded
        return HStack {
            if pageIndex > 0 {
                VStack {
                    BarArrow(direction: .left, color: .white, thickness: 2)
                        .scaleEffect(2.0)
                }
                .onTapGesture {
                    self.pagerStore.animateTo(Double(pageIndex - 1))
                }
            }
            Spacer()
            if pageIndex < self.pageCount - 1 {
                VStack {
                    BarArrow(direction: .right, color: .white, thickness: 2)
                        .scaleEffect(2.0)
                }
                .onTapGesture {
                    self.pagerStore.animateTo(Double(pageIndex + 1))
                }
            }
        }
        .frame(maxHeight: .infinity)
    }
}

extension PagerView {
    func onChangePage(perform action: @escaping OnChangePage) -> Self {
        var copy = self
        copy.changePageAction = action
        return copy
    }
}

class PagerStore: ObservableObject {
    @Published var index: Double = 0
    @Published var indexRounded: Int = 0
    @Published var offset: CGFloat = 0
    @Published var isGestureActive: Bool = false
    var width: CGFloat = Screen.width
    var numPages = 2
    var cancel: AnyCancellable?
    
    init() {
        self.cancel = self.$index
            .drop { !isRoundNumber($0) }
            .filter(isRoundNumber)
            .map { Int($0) }
            .assign(to: \.indexRounded, on: self)
    }
    
    func animateTo(_ index: Double) {
        print("animateTo from \(self.index) to \(index)")
        self.offset = CGFloat(self.index) * -self.width
        self.isGestureActive = true
        withAnimation(.spring()) {
            self.offset = -width * CGFloat(index)
        }
        DispatchQueue.main.async {
            self.index = index
            self.isGestureActive = false
        }
    }
    
    func onDragEnd(_ value: DragGesture.Value) {
        print("drag end")
        if !isGestureActive {
            self.offset = CGFloat(self.index) * -self.width
        }
        self.isGestureActive = true
        let end = value.predictedEndTranslation.width
        if -end >= width / 4 {
            self.index = min(round(self.index + 1), Double(numPages - 1))
        }
        if -end < width / 4 {
            self.index = max(0, round(self.index - 1))
        }
        // try and match speed roughly to their drag speed
        let speed = min(1, abs(end / Screen.width))
        let springResponse = Double(max(0.15, min(0.85, 1 - speed)))
        withAnimation(.spring(response: springResponse)) {
            self.offset = -width * CGFloat(self.index)
        }
        DispatchQueue.main.async {
            self.isGestureActive = false
        }
    }
}


#if DEBUG
struct PagerTest: View {
    @State var dragEndValue: DragGesture.Value?

    var body: some View {
        return VStack {
            PagerView(
                pageCount: 2,
                pagerStore: PagerStore(),
                pageTurnArrows: true
            ) {
                Color.red
                Color.blue
            }
        }
    }
}

struct Pager_Previews: PreviewProvider {
    static var previews: some View {
        PagerTest()
    }
}
#endif
