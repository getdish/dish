import SwiftUI

struct GridView<Content: View>: View {
  let rows: Int
  let cols: Int
  let content: (Int, Int, Int) -> Content
  let spacing: CGFloat

  init(
    rows: Int,
    cols: Int,
    spacing: CGFloat = 12,
    @ViewBuilder content: @escaping (Int, Int, Int) -> Content
  ) {
    self.rows = rows
    self.cols = cols
    self.spacing = spacing
    self.content = content
  }

  var body: some View {
    GeometryReader { geometry in
      VStack(spacing: self.spacing) {
        ForEach(0..<self.rows, id: \.self) { row in
          HStack(spacing: self.spacing) {
            ForEach(0..<self.cols, id: \.self) { column in
              self
                .content(row, column, row * self.cols + column)
                .frame(width: geometry.size.width / CGFloat(self.cols), alignment: .center)
            }
          }
        }
      }
      .frame(width: geometry.size.width, height: geometry.size.height, alignment: .center)
    }
  }
}
