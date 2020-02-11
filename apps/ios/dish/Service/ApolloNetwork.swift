import Foundation
import Apollo
import ApolloWebSocket

class ApolloNetwork {
    static let shared = ApolloNetwork()
    let graphEndpoint = "https://hasura.io/learn/graphql"
    var apolloClient : ApolloClient?
    
    private init (){
    }
    
    func setApolloClient(accessToken: String){
        self.apolloClient = {
            let authPayloads = ["Authorization": "Bearer \(accessToken)"]
            let configuration = URLSessionConfiguration.default
            configuration.httpAdditionalHeaders = authPayloads
            let endpointURL = URL(string: graphEndpoint)!
            return ApolloClient(networkTransport: HTTPNetworkTransport(url: endpointURL, configuration: configuration))
        }()
    }
}
