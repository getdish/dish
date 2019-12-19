//
//  Store.swift
//  new-dish
//
//  Created by Majid Jabrayilov on 12/5/19.
//  Copyright © 2019 Majid Jabrayilov. All rights reserved.
//
import SwiftUI
import Combine

struct Effect<Action> {
    let publisher: AnyPublisher<Action, Never>
}

struct Reducer<State, Action> {
    let reduce: (inout State, Action) -> Void
}

final class Store<State, Action>: ObservableObject {
    @Published private(set) var state: State

    private let reducer: Reducer<State, Action>
    private var cancellables: Set<AnyCancellable> = []

    init(initialState: State, reducer: Reducer<State, Action>) {
        self.state = initialState
        self.reducer = reducer
    }

    func send(_ action: Action) {
        print("send \(action)")
        reducer.reduce(&state, action)
    }

    func send(_ effect: Effect<Action>) {
        print("send \(effect)")
        var cancellable: AnyCancellable?
        var didComplete = false

        cancellable = effect
            .publisher
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] _ in
                    didComplete = true
                    if let effectCancellable = cancellable {
                        self?.cancellables.remove(effectCancellable)
                    }
                }, receiveValue: send)

        if !didComplete, let effectCancellable = cancellable {
            cancellables.insert(effectCancellable)
        }
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

    // TODO not working
//    func mock(_ state: State) -> Store {
//        Store<State, Action>.init(
//            initialState: state,
//            reducer: Reducer<State, Action> { x, y in
//                print("mocked, empty")
//            }
//        )
//    }
}
