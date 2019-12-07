import SwiftUI

class Actions {
  static func pressShutter() {
    if Store.home.currentPage == .camera {
      Store.camera.capture()
    } else {
      withAnimation(.spring(response: 0.3)) {
        Store.home.pager.animateTo(1.0)
      }
    }
  }
}
