import SwiftUI

struct AppGeometryReader<Content>: View where Content: View {
  @Environment(\.geometry) var appGeometry
  var content: (GeometryProxy) -> Content

  init(@ViewBuilder content: @escaping (GeometryProxy) -> Content) {
    self.content = content
  }

  var body: some View {
    Group {
      if appGeometry != nil {
        self.content(appGeometry!)
      } else {
        Color.clear
      }
    }
  }
}
