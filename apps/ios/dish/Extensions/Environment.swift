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
