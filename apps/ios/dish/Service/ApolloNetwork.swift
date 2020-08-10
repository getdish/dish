import Apollo
import Foundation

class ApolloNetwork {
  static let shared = ApolloNetwork()

  private(set) lazy var apollo = ApolloClient(
    url: URL(string: "https://hasura.dishapp.com/v1/graphql")!)
}
