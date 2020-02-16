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
