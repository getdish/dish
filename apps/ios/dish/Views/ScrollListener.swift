import SwiftUI
import Combine

struct ScrollListener: View {
  var name: String = "ScrollListener"
  var debounce: Double = 0
  var onScrollStart: (() -> Void)? = nil
  var onScrollEnd: (() -> Void)? = nil
  var throttle: Double = 0
  
  @State var didSendStart = false
  @State private var cancellables: Set<AnyCancellable> = []
  @State var events = ScrollEvents()
  
  class ScrollEvents: ObservableObject {
    @Published var lastScroll = 0
  }
  
  var onScroll: ((CGRect) -> Void)? = nil

  var body: some View {
    Color.clear
      .frame(height: 0)
      .onAppear(perform: self.start)
      .overlay(
        GeometryReader { geometry -> Run in
          let frame: CGRect = geometry.frame(in: .global)
          self.events.lastScroll = Int.random(in: 0...10000)
          return Run(self.name, level: .debug, debounce: self.debounce, throttle: self.throttle) {
            if let cb = self.onScroll {
              cb(frame)
            }
          }
        }
      )
  }
  
  func start() {
    // callbacks
    events.$lastScroll
      .dropFirst()
      .removeDuplicates()
      .map { _ in
        if !self.didSendStart,
          let cb = self.onScrollStart {
          async {
            self.didSendStart = true
            cb()
          }
        }
    }
    .debounce(for: .milliseconds(120), scheduler: App.queueMain)
    .sink { _ in
      self.didSendStart = false
      if let cb = self.onScrollEnd {
        cb()
      }
    }
    .store(in: &self.cancellables)
  }
}
