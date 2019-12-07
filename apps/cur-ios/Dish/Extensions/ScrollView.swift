import SwiftUI

typealias ScrollCallback = (CGRect) -> Void

extension View {
  func onScroll(_ scrollHandler: @escaping ScrollCallback) -> some View {
    background(
      GeometryReader { geometry -> EmptyView in
        scrollHandler(geometry.frame(in: .global))
        return EmptyView()
      }
    )
  }
}
