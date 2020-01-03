//
//  Environment.swift
//  new-dish
//
//  Created by Majid Jabrayilov on 12/12/19.
//  Copyright © 2019 Majid Jabrayilov. All rights reserved.
//
import SwiftUI

struct GeometryKey: EnvironmentKey {
    static let defaultValue: GeometryProxy? = nil
}

struct InputEventsKey: EnvironmentKey {
    static let defaultValue: InputEvents? = nil
}

extension EnvironmentValues {
    var geometry: GeometryProxy? {
        get { self[GeometryKey.self] }
        set { self[GeometryKey.self] = newValue }
    }
    
    var inputEvents: InputEvents? {
        get { self[InputEventsKey.self] }
        set { self[InputEventsKey.self] = newValue }
    }
}
