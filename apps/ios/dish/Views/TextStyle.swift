import SwiftUI

// our own text styles

struct TextStyle: ViewModifier {
    enum TextStyleType {
        case title, subtitle
    }
    
    var style: TextStyleType
    
    init(_ style: TextStyleType = .title) {
        self.style = style
    }
    
    func body(content: Content) -> some View {
        Group {
            if self.style == .title {
                content
                    .font(.title)
            } else {
                content
                    .font(.subheadline)
            }
            
        }
    }
}

