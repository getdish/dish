import Combine
import SwiftUI

let initialDrawerHeight = Screen.height * 0.65
let initialDrawerFullHeight = Screen.height - 100

enum CurrentPage {
  case home, camera
}

class HomeStore: ObservableObject {
  let pager = PagerStore()
  @Published var dish: Landmark? = nil
  @Published var showMenuDrawer = false
  @Published var showDrawer = true
  @Published private(set) var currentPage: CurrentPage = .home
  @Published var currentDrawerHeight: CGFloat = initialDrawerHeight
  var cancel: AnyCancellable?
  
  var isOnHomePage: Bool {
    return self.currentPage == .home
  }
  
  init() {
    self.cancel = self.pager.$indexRounded
      .map { $0 == 0 ? CurrentPage.home : CurrentPage.camera }
      .assign(to: \.currentPage, on: self)
  }
  
  func closeGallery() {
    dish = nil
  }
}
