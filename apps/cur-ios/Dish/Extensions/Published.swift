import Foundation
import Combine

private var cancellables = [String:AnyCancellable]()
private var keys = Set<String>()

extension Published {
  init(wrappedValue defaultValue: Value, key: String) {
    if keys.contains(key) {
      print("duplicate published key \(key)")
      exit(0)
//      throw DuplicateKeyError.exists
    }
    let value = UserDefaults.standard.object(forKey: key) as? Value ?? defaultValue
    self.init(initialValue: value)
    cancellables[key] = projectedValue.sink { val in
      UserDefaults.standard.set(val, forKey: key)
    }
  }
}

//enum DuplicateKeyError: Error {
//  case exists
//}
