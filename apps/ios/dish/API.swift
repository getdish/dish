//  This file was automatically generated and should not be edited.

import Apollo
import Foundation

public final class SearchRestaurantsQuery: GraphQLQuery {
  /// The raw GraphQL definition of this operation.
  public let operationDefinition =
    """
    query SearchRestaurants {
      restaurant(where: {location: {_st_d_within: {distance: 0.005, from: {type: "Point", coordinates: [-122.421351, 37.759251]}}}}) {
        __typename
        name
        location
      }
    }
    """

  public let operationName = "SearchRestaurants"

  public init() {
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["query_root"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("restaurant", arguments: ["where": ["location": ["_st_d_within": ["distance": 0.005, "from": ["type": "Point", "coordinates": [-122.421351, 37.759251]]]]]], type: .nonNull(.list(.nonNull(.object(Restaurant.selections))))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(restaurant: [Restaurant]) {
      self.init(unsafeResultMap: ["__typename": "query_root", "restaurant": restaurant.map { (value: Restaurant) -> ResultMap in value.resultMap }])
    }

    /// fetch data from the table: "restaurant"
    public var restaurant: [Restaurant] {
      get {
        return (resultMap["restaurant"] as! [ResultMap]).map { (value: ResultMap) -> Restaurant in Restaurant(unsafeResultMap: value) }
      }
      set {
        resultMap.updateValue(newValue.map { (value: Restaurant) -> ResultMap in value.resultMap }, forKey: "restaurant")
      }
    }

    public struct Restaurant: GraphQLSelectionSet {
      public static let possibleTypes = ["restaurant"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("name", type: .nonNull(.scalar(String.self))),
        GraphQLField("location", type: .scalar(String.self)),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(name: String, location: String? = nil) {
        self.init(unsafeResultMap: ["__typename": "restaurant", "name": name, "location": location])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var name: String {
        get {
          return resultMap["name"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "name")
        }
      }

      public var location: String? {
        get {
          return resultMap["location"] as? String
        }
        set {
          resultMap.updateValue(newValue, forKey: "location")
        }
      }
    }
  }
}
