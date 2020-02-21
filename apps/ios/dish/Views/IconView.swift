import SwiftUI

struct IconView: View {
    var background: AnyView = AnyView(Color.red)
    var cornerRadius: CGFloat = 16
    var image: Image = Image(systemName: "star")
    var imageSize: CGFloat = 32
    var padding: CGFloat = 12
    var label: String = "Hello World"
    var labelStyle: Text.Style = .iconLabel
    
    var body: some View {
        VStack {
            self.image
                .resizable()
                .scaledToFit()
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

