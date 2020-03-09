import Combine
import SwiftUI

enum LogLevel: Int {
  case off = 0
  case debug = 1
  case info = 2
  case warn = 3
  case error = 4
}

fileprivate let DEBUG_SIDE_EFFECTS: LogLevel = .info

struct SideEffect: View {
  static let None = SideEffect("", level: .off)

  let level: LogLevel
  let debounce: Double
  let throttle: Double
  let condition: (() -> Bool)?
  let block: () -> Void
  let name: String

  init(
    _ name: String, level: LogLevel = .info, debounce: Double = 0, throttle: Double = 0,
    condition: (() -> Bool)? = nil, block: @escaping () -> Void = {}
  ) {
    self.name = name
    self.level = level
    self.condition = condition
    self.debounce = debounce
    self.throttle = throttle
    self.block = block
  }

  var body: some View {
    Group {
      if self.condition?() == false {
        Color.clear
      } else {
        Run(self.name, level: self.level, debounce: debounce, throttle: throttle, block: self.block)
      }
    }
  }
}

// prefer this ^ except for extremely-often-running things

class RunState: ObservableObject {
  @Published var debounceRun: Date = Date()
  @Published var throttleRun: Date = Date()
  var cancellables: Set<AnyCancellable> = []
  
  func start(_ parent: Run) {
    if parent.debounce > 0 {
      self.$debounceRun
        .debounce(for: .milliseconds(Int(parent.debounce)), scheduler: App.queueMain)
        .sink { _ in
          parent.run()
      }
      .store(in: &self.cancellables)
    }
    if parent.throttle > 0 {
      self.$throttleRun
        .throttle(
          for: .milliseconds(Int(parent.throttle)), scheduler: App.queueMain, latest: true
      )
        .sink { _ in
          parent.run()
      }
      .store(in: &self.cancellables)
    }
  }
}

struct Run: View {
  let name: String
  let level: LogLevel
  let debounce: Double
  let throttle: Double
  let block: () -> Void
  @State var state: RunState = RunState()

  init(
    _ name: String, level: LogLevel = .info, debounce: Double = 0, throttle: Double = 0,
    block: @escaping () -> Void
  ) {
    self.name = name
    self.level = level
    self.debounce = debounce
    self.throttle = throttle
    self.block = block
  }

  var body: some View {
    async {
      if self.throttle > 0 {
        self.state.throttleRun = Date()
      } else if self.debounce > 0 {
        self.state.debounceRun = Date()
      } else {
        self.run()
      }
    }
    return Color.clear
      .onAppear { self.state.start(self) }
  }

  func run() {
    self.log()
    self.block()
  }

  func log() {
    if self.level.rawValue >= DEBUG_SIDE_EFFECTS.rawValue {
      let logThrottle = throttle > 0 ? " throttled" : ""
      let logDebounce = debounce > 0 ? " debounced" : ""
      print(" ⏩\(logThrottle)\(logDebounce) \(self.name)")
    }
  }
}

struct RunOnce: View {
  let name: String
  var block: () -> Void

  var body: some View {
    Color.clear.onAppear {
      print("RunOnce \(self.name)")
      self.block()
    }
  }
}
