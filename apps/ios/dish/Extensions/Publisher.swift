import Combine

extension Publisher where Failure == Never {
  func eraseToEffect() -> Effect<Output> {
    Effect(publisher: eraseToAnyPublisher())
  }
}
