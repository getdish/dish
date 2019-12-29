import SwiftUI
import Combine

typealias OnChangePage = (_ curPage: Int) -> Void

// TODO i'm just using PagerStore as a global (pStore), because @EnvironmentObject gave me
// trouble, i couldn't get it to react inside views for some reason...

func isRoundNumber(_ num: Double) -> Bool {
    return num.truncatingRemainder(dividingBy: 1.0) == 0.0
}

struct PagerView<Content: View>: View {
    @ObservedObject var pagerStore = PagerStore()
    var disableDragging = false
    var pageTurnArrows = false
    var content: Content
    var pageCount: Int
    
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
        self.pagerStore.changePageAction = action
        return self
    }
}

class PagerStore: ObservableObject {
    @Published var index: Double
    @Published var indexRounded: Int
    @Published var indexLast: Int
    @Published var offset: CGFloat = 0
    @Published var isGestureActive: Bool = false
    var width: CGFloat = Screen.width
    var numPages = 2
    var cancels: [AnyCancellable] = []
    var changePageAction: OnChangePage?
    
    init(index: Double = 0) {
        self.index = index
        self.indexLast = Int(index)
        self.indexRounded = Int(index)
        
        // indexRounded
        self.cancels.append(
            self.$index
                .drop { !isRoundNumber($0) }
                .filter(isRoundNumber)
                .map { Int($0) }
                .assign(to: \.indexRounded, on: self)
        )
        
        // indexLast
        self.cancels.append(
            self.$index
                .drop { !isRoundNumber($0) }
                .filter(isRoundNumber)
                .map { Int($0) }
                .assign(to: \.indexRounded, on: self)
        )
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
            self.indexLast = Int(self.index)
            self.isGestureActive = false
            self.triggerPageChange()
        }
    }
    
    func drag(_ offset: Double) {
        self.index = Double(self.indexLast) + offset
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
            self.indexLast = Int(self.index)
            self.isGestureActive = false
            self.triggerPageChange()
        }
    }
    
    func triggerPageChange() {
        if let cb = self.changePageAction {
            if self.index.truncatingRemainder(dividingBy: 1.0) == 0.0 {
                cb(Int(self.index))
            }
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
