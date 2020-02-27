//
//  Store.swift
//  Recipes
//
//  Created by Majid Jabrayilov on 11/10/19.
//  Copyright © 2019 Majid Jabrayilov. All rights reserved.
//
import SwiftUI
import Combine

typealias Reducer<State, Action> = (inout State, Action) -> Void

struct Effect<Action> {
    let publisher: AnyPublisher<Action, Never>
}

final class Store<State, Action>: ObservableObject {

    @Published private(set) var state: State
    
    private let reducer: Reducer<State, Action>
    private var cancellables: Set<AnyCancellable> = []
    private var viewCancellable: AnyCancellable?
    
    init(initialState: State, reducer: @escaping Reducer<State, Action>) {
        self.state = initialState
        self.reducer = reducer
    }
    
    func send(_ action: Action) {
        print(" 🔀 (action) \(String(describing: action).truncated(limit: 250))")
        reducer(&state, action)
    }
    
    func send(_ effect: Effect<Action>) {
        print(" 🔀 (effect) \(String(describing: effect).truncated(limit: 250))")
        var didComplete = false
        var cancellable: AnyCancellable?
        cancellable = effect
            .publisher
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: { [weak self] _ in
                didComplete = true
                if let cancellable = cancellable {
                    self?.cancellables.remove(cancellable)
                }
                }, receiveValue: send)
        if !didComplete, let cancellable = cancellable {
            cancellables.insert(cancellable)
        }
    }
}

extension Store {
    func view<ViewState, ViewAction>(
        state toLocalState: @escaping (State) -> ViewState,
        action toGlobalAction: @escaping (ViewAction) -> Action
    ) -> Store<ViewState, ViewAction> {
        let viewStore = Store<ViewState, ViewAction>(
            initialState: toLocalState(state)
        ) { state, action in
            self.send(toGlobalAction(action))
        }
        viewStore.viewCancellable = $state
            .map(toLocalState)
            .assign(to: \.state, on: viewStore)
        return viewStore
    }
}

extension Store {
    func binding<Value>(
        for keyPath: KeyPath<State, Value>,
        _ action: @escaping (Value) -> Action
    ) -> Binding<Value> {
        Binding<Value>(
            get: { self.state[keyPath: keyPath] },
            set: { self.send(action($0)) }
        )
    }
}

//extension Store where State: Codable {
//    func save() {
//        DispatchQueue.global(qos: .utility).async {
//            guard
//                let documentsURL = Current.files.urls(for: .applicationSupportDirectory, in: .userDomainMask).first,
//                let data = try? Current.encoder.encode(self.state)
//                else { return }
//
//            try? Current.files.createDirectory(
//                at: documentsURL,
//                withIntermediateDirectories: true,
//                attributes: nil
//            )
//
//            let stateURL = documentsURL.appendingPathComponent("state.json")
//
//            if Current.files.fileExists(atPath: stateURL.absoluteString) {
//                try? Current.files.removeItem(at: stateURL)
//            }
//
//            try? data.write(to: stateURL, options: .atomic)
//        }
//    }
//
//    func load() {
//        DispatchQueue.global(qos: .utility).async {
//            guard
//                let documentsURL = Current.files.urls(for: .applicationSupportDirectory, in: .userDomainMask).first,
//                let data = try? Data(contentsOf: documentsURL.appendingPathComponent("state.json")),
//                let state = try? Current.decoder.decode(State.self, from: data)
//                else { return }
//
//            DispatchQueue.main.async {
//                self.state = state
//            }
//        }
//    }
//}
