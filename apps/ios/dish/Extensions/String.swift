// https://gist.github.com/budidino/8585eecd55fd4284afaaef762450f98e

import Foundation
import SwiftUI

extension String {
  enum TruncationPosition {
    case head
    case middle
    case tail
  }
  
  func truncated(limit: Int, position: TruncationPosition = .tail, leader: String = "...") -> String {
    guard self.count > limit else { return self }
    
    switch position {
      case .head:
        return leader + self.suffix(limit)
      case .middle:
        let headCharactersCount = Int(ceil(Float(limit - leader.count) / 2.0))
        
        let tailCharactersCount = Int(floor(Float(limit - leader.count) / 2.0))
        
        return "\(self.prefix(headCharactersCount))\(leader)\(self.suffix(tailCharactersCount))"
      case .tail:
        return self.prefix(limit) + leader
    }
  }
}

extension String {
  func image(size: Double = 24) -> UIImage? {
    let size = CGSize(width: size, height: size)
    UIGraphicsBeginImageContextWithOptions(size, false, 0)
    UIColor.clear.set()
    let rect = CGRect(origin: .zero, size: size)
    UIRectFill(CGRect(origin: .zero, size: size))
    (self as AnyObject).draw(in: rect, withAttributes: [.font: UIFont.systemFont(ofSize: 24)])
    let image = UIGraphicsGetImageFromCurrentImageContext()
    UIGraphicsEndImageContext()
    return image
  }
}

extension StringProtocol {
  subscript(_ offset: Int)                     -> Element     { self[index(startIndex, offsetBy: offset)] }
  subscript(_ range: Range<Int>)               -> SubSequence { prefix(range.lowerBound+range.count).suffix(range.count) }
  subscript(_ range: ClosedRange<Int>)         -> SubSequence { prefix(range.lowerBound+range.count).suffix(range.count) }
  subscript(_ range: PartialRangeThrough<Int>) -> SubSequence { prefix(range.upperBound.advanced(by: 1)) }
  subscript(_ range: PartialRangeUpTo<Int>)    -> SubSequence { prefix(range.upperBound) }
  subscript(_ range: PartialRangeFrom<Int>)    -> SubSequence { suffix(Swift.max(0, count-range.lowerBound)) }
}

extension LosslessStringConvertible {
  var string: String { .init(self) }
}

extension BidirectionalCollection {
  subscript(safe offset: Int) -> Element? {
    guard !isEmpty, let i = index(startIndex, offsetBy: offset, limitedBy: index(before: endIndex)) else { return nil }
    return self[i]
  }
}
