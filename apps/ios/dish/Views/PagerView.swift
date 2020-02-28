import Combine
import SwiftUI

typealias OnChangePage = (_ curPage: Int) -> Void
typealias OnChangeDrag = (_ isDragging: Bool) -> Void

// TODO i'm just using PagerStore as a global (pStore), because @EnvironmentObject gave me
// trouble, i couldn't get it to react inside views for some reason...

func isRoundNumber(_ num: Double) -> Bool {
  return num.truncatingRemainder(dividingBy: 1.0) == 0.0
}

struct PagerView<Content: View>: View {
  @ObservedObject var pagerStore = PagerStore()
  var disableDragging = false
  var pageTurnArrows = false
  var content: (Bool?) -> Content
  var pageCount: Int

  init(
    pageCount: Int,
    pagerStore: PagerStore,
    disableDragging: Bool = false,
    pageTurnArrows: Bool = false,
    @ViewBuilder content: @escaping (Bool?) -> Content
  ) {
    self.pageCount = pageCount
    self.pagerStore = pagerStore
    pagerStore.numPages = pageCount
    self.disableDragging = disableDragging
    self.pageTurnArrows = pageTurnArrows
    self.content = content
  }

  var body: some View {
    GeometryReader { geometry in
      HStack(alignment: .center, spacing: 0) {
        self.content(self.pagerStore.isGestureActive)
          .frame(width: geometry.size.width)
      }
        .offset(
          x: self.pagerStore.isGestureActive
            ? self.pagerStore.offset
            : -geometry.size.width * CGFloat(self.pagerStore.index)
        )
        .frame(width: geometry.size.width, height: nil, alignment: .leading)
        .overlay(self.overlay)
        .gesture(
          self.disableDragging
            ? nil
            : DragGesture(minimumDistance: 20)
            .onChanged({ value in
              self.pagerStore.drag(value)
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

  func onChangeDrag(perform action: @escaping OnChangeDrag) -> Self {
    self.pagerStore.changeDragAction = action
    return self
  }
}

class PagerStore: ObservableObject {
  @Published var index: Double
  @Published var indexRounded: Int
  @Published var indexLast: Int
  @Published var offset: CGFloat = 0
  @Published var isGestureActive: Bool = false
  var width: CGFloat = App.screen.width
  var numPages = 2
  var cancels: Set<AnyCancellable> = []
  var changePageAction: OnChangePage?
  var changeDragAction: OnChangeDrag?

  init(index: Double = 0) {
    self.index = index
    self.indexLast = Int(index)
    self.indexRounded = Int(index)

    // indexRounded
    self.$index
      .drop { !isRoundNumber($0) }
      .filter(isRoundNumber)
      .map { Int($0) }
      .assign(to: \.indexRounded, on: self)
      .store(in: &cancels)

    // indexLast
    self.$index
      .drop { !isRoundNumber($0) }
      .filter(isRoundNumber)
      .map { Int($0) }
      .assign(to: \.indexRounded, on: self)
      .store(in: &cancels)

    // callback onChangeDrag
    var last = false
    self.$index
      .removeDuplicates()
      .sink { i in
        async {
          if let cb = self.changeDragAction {
            let isRounded = i.truncatingRemainder(dividingBy: 1.0) == 0.0
            print("PagerStore.onChangeDrag \(i) \(isRounded) \(last)")
            if isRounded {
              if last == true {
                last = false
                cb(false)
              }
            } else {
              if last == false {
                last = true
                cb(true)
              }
            }
          }
        }
      }
      .store(in: &cancels)
  }

  func animateTo(_ index: Double) {
    print("animateTo from \(self.index) to \(index)")
    self.offset = CGFloat(self.index) * -self.width
    self.isGestureActive = true
    withAnimation(.spring()) {
      self.offset = -width * CGFloat(index)
    }
    async {
      self.index = index
      self.indexLast = Int(self.index)
      self.isGestureActive = false
      self.triggerPageChange()
    }
  }

  func drag(_ value: DragGesture.Value) {
    self.isGestureActive = true
    self.index = Double(self.indexLast) + Double(-value.translation.width / self.width)
    self.offset = CGFloat(self.index) * -self.width
  }

  func onDragEnd(_ value: DragGesture.Value) {
    if !isGestureActive {
      self.offset = CGFloat(self.index) * -self.width
    }
    self.isGestureActive = true
    let end = value.predictedEndTranslation.width

    // swipe to right
    let last = Double(self.indexLast)
    if -end >= width / 3 {
      self.index = min(last + 1, Double(numPages - 1))
    }  // swipe to left
    else if end >= width / 3 {
      self.index = max(0, last - 1)
    }  // didnt finish a swipe
    else {
      self.index = last
    }

    // try and match speed roughly to their drag speed
    let speed = min(1, abs(end / App.screen.width))
    let springResponse = Double(max(0.15, min(0.85, 1 - speed)))

    print(
      "PagerView.dragEnd to \(end) \(index).... speed \(speed) springResponse \(springResponse)")

    withAnimation(.spring(response: springResponse)) {
      self.offset = -width * CGFloat(self.index)
    }

    async {
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
        ) { isDragging in
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
