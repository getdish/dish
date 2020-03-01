import SwiftUI

struct ListItemGallery<ImageContent, Content>: View where Content: View, ImageContent: View {
  typealias ListItemGalleryContentFn = (Int, CGFloat, Bool) -> ImageContent
  
  var getImage: ListItemGalleryContentFn
  var content: Content
  var imageSize: CGFloat
  var defaultImagesVisible: Double = 1.3
  var total: Int
  var onScrollStart: (() -> Void)?
  var onScrollEnd: (() -> Void)?
  var onScrolledToStart: (() -> Void)?
  var padding: CGFloat
  
  init(
    getImage: @escaping ListItemGalleryContentFn,
    imageSize: CGFloat = 90,
    total: Int = 1,
    onScrollStart: (() -> Void)? = nil,
    onScrollEnd: (() -> Void)? = nil,
    onScrolledToStart: (() -> Void)? = nil,
    padding: CGFloat = 3,
    @ViewBuilder content: () -> Content
  ) {
    self.imageSize = imageSize
    self.total = total
    self.onScrollStart = onScrollStart
    self.onScrollEnd = onScrollEnd
    self.onScrolledToStart = onScrolledToStart
    self.padding = padding
    self.content = content()
    self.getImage = getImage
  }

  @EnvironmentObject var screen: ScreenModel
  @State var scrollX: CGFloat = 0
  
  var size: CGFloat {
    imageSize + padding * 2
  }
  
  var body: some View {
    let activeIndex = CGFloat(self.scrollX / size)
    return ZStack {
      ZStack {
        ScrollView(.horizontal, showsIndicators: false) {
          HStack(spacing: 0) {
            ScrollListener(
              name: "ListItemGallery",
              onScrollStart: self.onScrollStart,
              onScrollEnd: self.onScrollEnd
            ) { frame in
              async {
                let x = -frame.minX
                self.scrollX = x
                if x <= 0 {
                  if let cb = self.onScrolledToStart {
                    cb()
                  }
                }
              }
            }
            
            Color.clear.introspectScrollView { scrollView in
              let x: UIScrollView = scrollView
              x.clipsToBounds = false
            }
            
            self.content.frame(width:
              self.screen.width - (self.imageSize + self.padding) * CGFloat(self.defaultImagesVisible)
            )
            
            HStack {
              ForEach(0..<self.total) { index in
                ListItemGalleryImage(
                  activeIndex: activeIndex,
                  imageSize: self.imageSize,
                  index: index,
                  size: self.size,
                  getImage: self.getImage
                )
              }
            }
            .frame(width: size * CGFloat(total))
          }
          .padding(.trailing, self.screen.width / 2.5)
        }
      }
      .frame(width: self.screen.width, height: imageSize)
    }
  }
  
  func getImageXPosition(_ index: Int, activeIndex: Int) -> CGFloat {
    index < activeIndex
      ? self.scrollX - (size * CGFloat(index)) - 140
      : 0
  }
}

struct ListItemGalleryImage<Content>: View, Identifiable where Content: View {
  var activeIndex: CGFloat
  var imageSize: CGFloat
  var index: Int
  var size: CGFloat
  let stageActiveOffset: CGFloat = 0.8
  let stageTime = 0.99
  var getImage: (Int, CGFloat, Bool) -> Content
  
  var id: Int { self.index }
  
  var lB: Double {
    1 - stageTime
  }
  
  var uB: Double {
    stageTime
  }
  
  func getStrength(_ index: Double? = nil, minIndex: CGFloat = 0) -> CGFloat {
    let x0 = activeIndex - stageActiveOffset - CGFloat(index ?? Double(self.index))
    return min(2, max(minIndex, x0)) // 0 = stage left, 1 = onstage, 2 = stage right
  }
  
  func scaleFactor(_ index: Double? = nil, minIndex: CGFloat = 0) -> CGFloat {
    let x1 = getStrength(index, minIndex: minIndex)
    let x2 = x1 >= CGFloat(lB) && x1 <= CGFloat(uB) ? 1 : x1
    return x2
  }
  
  var scale: CGFloat {
    let s = scaleFactor()
    return 1 + (
      s > 1
        ? max(((2 - s) * 0.8), 0.6)
        : s * 0.8
    )
  }
  
  var opacityScaled: Double {
    let x = min(1, scaleFactor(Double(index) + uB + 0.5))
    return max(0.5, x == 0 ? 1 : lB - Double(x))
  }
  
  var isActive: Bool {
    return self.scaleFactor() == 1
  }
  
  var body: some View {
    // -0.5 = at edge of other cards
    // 0 = starts zooming
    // 0.5 = pops onto stage
    // 1.5 pops off stage
    // 2 = offstage left
    let sf = scaleFactor()
    let strength = Double(getStrength(minIndex: -4.0))
    let isOnStage = sf == 1
    let sizeScaled = imageSize * scale
    let zIndex = isOnStage ? 100 : strength
    
    var x: Double = strength > lB ? -20 : -(strength / 5) * 10
    
    if isActive {
      x = x - (uB - strength) * Double(size)
    }
    
    return self.getImage(index, sizeScaled, isOnStage)
      .opacity(opacityScaled)
      .rotation3DEffect(.degrees(Double(1 - self.scale) * -7), axis: (0, 1, 0))
      //      .animation(.spring(), value: !self.isActive)
      //      .animation(.none, value: self.isActive)
      .position(
        x: CGFloat(x),
        y: size * 0.5 - (size - imageSize)
    )
      .transition(.slide)
      .animation(.none)
      .zIndex(zIndex)
  }
}

