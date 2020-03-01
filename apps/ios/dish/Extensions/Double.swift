import SwiftUI

extension CGFloat {
  func round(nearest: CGFloat) -> CGFloat {
    let n = 1 / nearest
    let numberToRound = self * n
    return numberToRound.rounded() / n
  }

  func floor(nearest: CGFloat) -> CGFloat {
    let intDiv = CGFloat(Int(self / nearest))
    return intDiv * nearest
  }
}
