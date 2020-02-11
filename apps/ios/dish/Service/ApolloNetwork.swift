import Foundation
import Apollo

class ApolloNetwork {
  static let shared = ApolloNetwork()

  private(set) lazy var apollo = ApolloClient(url: URL(string: "https://hasura.rio.dishapp.com/v1/graphql")!)
}
