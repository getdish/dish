import SwiftUI

struct GeometryKey: EnvironmentKey {
    static let defaultValue: GeometryProxy? = nil
}

struct SegmentedItemKey: EnvironmentKey {
    static let defaultValue: SegmentedItem? = nil
}

extension EnvironmentValues {
    var geometry: GeometryProxy? {
        get { self[GeometryKey.self] }
        set { self[GeometryKey.self] = newValue }
    }
    
    var itemSegment: SegmentedItem? {
        get { self[SegmentedItemKey.self] }
        set { self[SegmentedItemKey.self] = newValue }
    }
}
