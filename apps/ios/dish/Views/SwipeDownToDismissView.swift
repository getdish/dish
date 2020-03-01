import SwiftUI

struct SwipeDownToDismissView<Content>: View where Content: View {
  @State var dragY: CGFloat = 0
  @State var animateY: CGFloat = 0
  @State var opacity: Double = 1
  
  var onClose: (() -> Void)? = nil
  var content: () -> Content
  
  func scalePull(_ number: CGFloat) -> CGFloat {
    return ((number - 0) / (-500 - 0) * 4) + 1
  }
  
  var body: some View {
    ZStack {
      self.content()
        .offset(
          y: self.animateY + self.dragY
      )
        .opacity(self.opacity)
        .gesture(
          DragGesture()
            .onChanged { drag in
              var dy = drag.translation.height
              
              let lim: CGFloat = -60
              if dy < lim {
                let extra = dy + 60
                dy = lim + extra * (1 / self.scalePull(dy + 60))
              }
              
              self.dragY = dy
          }
          .onEnded { drag in
            let endY = drag.location.y + drag.predictedEndLocation.y
            let shouldClose = endY > 500
            print("ok endY \(endY)")
            
            if shouldClose {
              let continueY = drag.predictedEndTranslation.height
              let duration: Double = Double(continueY) / 500
              withAnimation(.easeOut(duration: duration)) {
                self.animateY = continueY
                self.opacity = 0
              }
              async(duration / 1000) {
                if let cb = self.onClose {
                  cb()
                }
              }
            } else {
              withAnimation(.spring()) {
                self.dragY = 0
              }
            }
          }
      )
    }
  }
}

