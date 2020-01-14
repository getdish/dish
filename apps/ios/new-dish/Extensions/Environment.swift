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

extension EnvironmentValues {
    var geometry: GeometryProxy? {
        get { self[GeometryKey.self] }
        set { self[GeometryKey.self] = newValue }
    }
}
