import SwiftUI

struct ListItemGallery<ImageContent, Content>: View where Content: View, ImageContent: View {
  typealias ListItemGalleryContentFn = (Int, CGFloat, Bool) -> ImageContent
  
  var getImage: ListItemGalleryContentFn
  var content: Content
  var defaultImagesVisible: Double
  var imageSize: CGFloat
  var total: Int
  var onScrollStart: (() -> Void)?
  var onScrollEnd: (() -> Void)?
  var onScrolledToStart: (() -> Void)?
  var padding: CGFloat
  enum DisplayContent { case scrolling, fixed }
  var displayContent: DisplayContent
  
  init(
    defaultImagesVisible: Double = 1.5,
    displayContent: DisplayContent = .scrolling,
    getImage: @escaping ListItemGalleryContentFn,
    imageSize: CGFloat = 90,
    total: Int = 1,
    onScrollStart: (() -> Void)? = nil,
    onScrollEnd: (() -> Void)? = nil,
    onScrolledToStart: (() -> Void)? = nil,
    padding: CGFloat = 3,
    @ViewBuilder content: () -> Content
  ) {
    self.defaultImagesVisible = defaultImagesVisible
    self.displayContent = displayContent
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
  
  func onScroll(_ frame: CGRect) {
    let x = -frame.minX
    if x != self.scrollX {
      async {
        self.scrollX = x
        if x <= 0 {
          if let cb = self.onScrolledToStart {
            cb()
          }
        }
      }
    }
  }
  
  var body: some View {
    let activeIndex = CGFloat(self.scrollX / size)
    let spaceSize: CGFloat = 20
    let contentWidth = self.screen.width - self.size * CGFloat(self.defaultImagesVisible) - spaceSize
    let prePad: CGFloat = 16
    
    return ZStack {
      if displayContent == .fixed {
        HStack(spacing: 0) {
          self.content
          Spacer()
          Spacer().frame(width: contentWidth * 0.72)
        }
        .padding(.leading, prePad)
      }
    
      ScrollView(.horizontal, showsIndicators: false) {
        HStack(spacing: 0) {
          // side effects
          Color.clear.frame(width: 0).overlay(
            Group {
              ScrollListener(
                name: "ListItemGallery",
                onScrollStart: self.onScrollStart,
                onScrollEnd: self.onScrollEnd,
                onScroll: self.onScroll
              )
              
              Color.clear.introspectScrollView { scrollView in
                let x: UIScrollView = scrollView
                x.clipsToBounds = false
              }
            }
          )
          
          Spacer().frame(width: prePad)

          // CONTENT
          Group {
            if displayContent == .scrolling {
              self.content
            } else {
              Color.clear
            }
          }
          .frame(width: contentWidth)
          
          Spacer()
          
          Color.clear.frame(width: spaceSize)
          
          HStack(spacing: 0) {
            ForEach(0..<total) { index in
              ListItemGalleryImage(
                activeIndex: activeIndex,
                imageSize: self.imageSize,
                index: index,
                size: self.size,
                getImage: self.getImage
              )
            }
            Spacer().frame(width: self.screen.width / 2.5)
          }
          .frame(width: size * CGFloat(total) + self.screen.width / 2.5)
        }
      }
      .frame(width: self.screen.width)
      .overlay(
        HStack {
          if self.scrollX == 0 {
            Color.black.opacity(0.0001)
              .frame(width: contentWidth)
          }
          Spacer()
        }
      )
    }
    .frame(width: self.screen.width, height: imageSize)
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
    
    var x: Double = Double(self.imageSize / 2)
    
    if Double(scale / 2) + strength > lB {
      x = x - 20
    }
    
    if isActive {
      x = x - (uB - strength) * Double(size)
    }
    
    return self
      .getImage(index, sizeScaled, isOnStage)
      .opacity(opacityScaled)
      .rotation3DEffect(.degrees(Double(1 - self.scale) * -7), axis: (0, 1, 0))
      .position(
        x: CGFloat(x),
        y: size * 0.5 - (size - imageSize)
      )
      .animation(.none)
      .zIndex(zIndex)
  }
}

