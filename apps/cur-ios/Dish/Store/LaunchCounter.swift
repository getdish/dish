//  MIT License. © 2019 Majid Jabrayilov. All rights reserved.
import Foundation

class LaunchCounter {
  private enum Launcher {
    static let first = "launcher_first.v1.1"
    static let count = "launcher_count"
    static let minLaunchCount = 7
    static let minDays = 3
  }
  
  private let defaults: UserDefaults
  init(defaults: UserDefaults = .standard) {
    self.defaults = defaults
  }
  
  @discardableResult
  func launch() -> Int {
    if defaults.object(forKey: Launcher.first) == nil {
      defaults.set(Date(), forKey: Launcher.first)
    }
    
    var count = defaults.integer(forKey: Launcher.count)
    count += 1
    defaults.set(count, forKey: Launcher.count)
    return count
  }
}
