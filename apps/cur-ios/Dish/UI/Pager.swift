import SwiftUI
import Combine

typealias OnChangePage = (_ curPage: Int) -> Void

// TODO i'm just using PagerStore as a global (pStore), because @EnvironmentObject gave me
// trouble, i couldn't get it to react inside views for some reason...

func isRoundNumber(_ num: Double) -> Bool {
  return num.truncatingRemainder(dividingBy: 1.0) == 0.0
}

struct Pager<Content: View & Identifiable>: View {
  @ObservedObject var pagerStore = PagerStore()
  var disableDragging = false
  var pageTurnArrows = false
  var pages: [Content]
  var changePageAction: OnChangePage?
  
  var body: some View {
    let pageIndex = self.pagerStore.indexRounded
    
    return GeometryReader { geometry in
      HStack(alignment: .center, spacing: 0) {
        ForEach(self.pages.indices) { index in
          self.pages[index]
            // first above second, etc
            .zIndex(Double(self.pages.count - index))
            .frame(width: geometry.size.width, height: nil)
        }
      }
      .offset(
        x: self.pagerStore.isGestureActive
          ? self.pagerStore.offset
          : -geometry.size.width * CGFloat(self.pagerStore.index)
      )
      .frame(width: geometry.size.width, height: nil, alignment: .leading)
      .overlay(
        !self.pageTurnArrows ? nil :
          HStack {
            if pageIndex > 0 {
              VStack {
                BarArrow(direction: .left, color: .white, thickness: 2)
                  .scaleEffect(2.0)
              }
              .frame(maxHeight: .infinity)
              .onTapGesture {
                self.pagerStore.animateTo(Double(pageIndex - 1))
              }
            }
            Spacer()
            if pageIndex < self.pages.count - 1 {
              VStack {
                BarArrow(direction: .right, color: .white, thickness: 2)
                  .scaleEffect(2.0)
              }
              .frame(maxHeight: .infinity)
              .onTapGesture {
                self.pagerStore.animateTo(Double(pageIndex + 1))
              }
            }
          }
          .frame(maxHeight: .infinity)
      )
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
}

extension Pager {
  func onChangePage(perform action: @escaping OnChangePage) -> Self {
    var copy = self
    copy.changePageAction = action
    return copy
  }
}


#if DEBUG
struct PagerTest: View {
  @State var dragEndValue: DragGesture.Value?

  var body: some View {
    return VStack {
      Pager(
        pageTurnArrows: true,
        pages: features.map { FeatureCard(landmark: $0) }
      )
//      Picker(selection: pStore.$index.animation(.easeInOut), label: Text("")) {
//        ForEach(0..<4) { page in Text("\(page + 1)").tag(Double(page)) }
//      }
//      .pickerStyle(SegmentedPickerStyle())
//      .padding()
    }
  }
}

struct Pager_Previews: PreviewProvider {
  static var previews: some View {
    PagerTest()
  }
}
#endif
