import SwiftUI

extension Text {
    // our own text styles
    enum Style {
        case h1, h2, iconLabel
    }
    
    func style(_ style: Style) -> Text {
        switch style {
            case .h1:
                return font(.system(size: 24))
                        .fontWeight(.semibold)
            case .h2:
                return font(.system(size: 20))
                        .fontWeight(.medium)
            
            case .iconLabel:
                return font(.system(size: 14))
                        .fontWeight(.semibold)
        }
    }

}
