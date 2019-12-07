import Combine
import SwiftUI

let queue = DispatchQueue(label: "stores")

class AppStore {
  let home = HomeStore()
  let camera = CameraStore()
  let location = LocationStore()
  let mapSearch = MapSearchStore()
  var cancels: [AnyCancellable] = []
  
  func start() {
    location.start()
    
    self.cancels.append(
      home.pager.$index.map { i in
        if i > 0.0 {
          self.camera.resume()
        } else {
          self.camera.pause()
        }
      }
      .sink {}
    )
  }
  
  func end() {
    cancels.forEach { $0.cancel() }
  }
}

let Store = AppStore()

//

class CameraStore: ObservableObject {
  enum CameraState {
    case paused, running, captured
  }
  
  @Published private(set) var state: CameraState = .paused
  @Published var showRestaurantDrawer = false
  
  var isCaptured: Bool {
    return state == .captured
  }
  
  init() {
  }
  
  func pause() {
    print("pause")
    if state != .paused {
      state = .paused
    }
  }
  
  func resume() {
    print("resume")
    if state != .running {
      state = .running
    }
  }
  
  func capture() {
    print("capture")
    state = .captured
  }
}
