import SwiftUI
import Combine

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
