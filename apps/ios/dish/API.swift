//  This file was automatically generated and should not be edited.

import Apollo
import Foundation

public final class SearchRestaurantsQuery: GraphQLQuery {
  /// The raw GraphQL definition of this operation.
  public let operationDefinition =
    """
    query SearchRestaurants($radius: Float!, $geo: geometry!) {
      restaurant(where: {location: {_st_d_within: {distance: $radius, from: $geo}}}, limit: 30) {
        __typename
        id
        name
        location
      }
    }
    """

  public let operationName = "SearchRestaurants"

  public var radius: Double
  public var geo: geometry

  public init(radius: Double, geo: geometry) {
    self.radius = radius
    self.geo = geo
  }

  public var variables: GraphQLMap? {
    return ["radius": radius, "geo": geo]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["query_root"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("restaurant", arguments: ["where": ["location": ["_st_d_within": ["distance": GraphQLVariable("radius"), "from": GraphQLVariable("geo")]]], "limit": 30], type: .nonNull(.list(.nonNull(.object(Restaurant.selections))))),
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
        GraphQLField("id", type: .nonNull(.scalar(uuid.self))),
        GraphQLField("name", type: .nonNull(.scalar(String.self))),
        GraphQLField("location", type: .scalar(geometry.self)),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(id: uuid, name: String, location: geometry? = nil) {
        self.init(unsafeResultMap: ["__typename": "restaurant", "id": id, "name": name, "location": location])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: uuid {
        get {
          return resultMap["id"]! as! uuid
        }
        set {
          resultMap.updateValue(newValue, forKey: "id")
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

      public var location: geometry? {
        get {
          return resultMap["location"] as? geometry
        }
        set {
          resultMap.updateValue(newValue, forKey: "location")
        }
      }
    }
  }
}
