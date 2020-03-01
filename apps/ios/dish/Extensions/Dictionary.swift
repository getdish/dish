import Apollo
import Foundation

extension Dictionary: JSONDecodable {
  /// Custom `init` extension so Apollo can decode custom scalar type `CurrentMissionChallenge `
  public init(jsonValue value: JSONValue) throws {
    guard let dictionary = value as? Dictionary else {
      throw JSONDecodingError.couldNotConvert(value: value, to: Dictionary.self)
    }
    self = dictionary
  }
}
