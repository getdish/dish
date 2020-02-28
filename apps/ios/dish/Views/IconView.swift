import SwiftUI

struct IconView: View {
  var background: Color = Color.red
  var cornerRadius: CGFloat = 16
  var image: AnyView = AnyView(Image(systemName: "star").resizable().scaledToFit())
  var imageSize: CGFloat = 32
  var padding: CGFloat = 12
  var label: String = "Hello World"
  var labelStyle: Text.Style = .iconLabel

  var body: some View {
    VStack {
      self.image
        .frame(width: self.imageSize, height: self.imageSize)
        .padding(self.padding)
        .background(self.background)
        .cornerRadiusSquircle(self.cornerRadius)

      VStack(alignment: .center) {
        Text(self.label)
          .style(self.labelStyle)
          .lineLimit(1)
      }
    }
  }
}
