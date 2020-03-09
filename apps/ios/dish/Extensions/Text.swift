import SwiftUI

extension Text {
  // our own text styles
  enum Style {
    case h1, h2, iconLabel, smallCapsSmallTitle
  }

  func style(_ style: Style) -> Text {
    switch style {
    case .h1:
      return font(.system(size: 28))
        .fontWeight(.semibold)
    case .h2:
      return font(.system(size: 20))
        .fontWeight(.medium)

    case .iconLabel:
      return font(.system(size: 14))
        .fontWeight(.semibold)

    case .smallCapsSmallTitle:
      return font(.system(size: 16))
        .fontWeight(.bold)
    }
  }

}
