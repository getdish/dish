import SwiftUI
import Combine

struct ScrollListener: View {
  var debounce: Double = 0
  var throttle: Double = 0
  var onScrollStart: (() -> Void)? = nil
  var onScrollEnd: (() -> Void)? = nil
  
  @State var didSendStart = false
  @State private var cancellables: Set<AnyCancellable> = []
  
  let events = ScrollEvents()
  class ScrollEvents: ObservableObject {
    @Published var lastScroll = 0
  }
  
  var onScroll: ((CGRect) -> Void)? = nil

  var body: some View {
    let events = self.events
    
    return Color.clear
      .frame(height: 0)
      .onAppear {
        // callbacks
        events.$lastScroll
          .map { _ in
            if !self.didSendStart,
              let cb = self.onScrollStart {
              self.didSendStart = true
              cb()
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
      .overlay(
        GeometryReader { geometry -> Run in
          let frame: CGRect = geometry.frame(in: .global)
          self.events.lastScroll = Int.random(in: 0...10000)
          return Run(
            "ScrollListener", level: .debug, debounce: self.debounce, throttle: self.throttle
          ) {
            if let cb = self.onScroll {
              cb(frame)
            }
          }
        }
      )
  }
}
