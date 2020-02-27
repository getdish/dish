import SwiftUI

extension EnvironmentValues {
    struct GeometryKey: EnvironmentKey {
        static let defaultValue: GeometryProxy? = nil
    }
    var geometry: GeometryProxy? {
        get { self[GeometryKey.self] }
        set { self[GeometryKey.self] = newValue }
    }
    
    struct SegmentedItemKey: EnvironmentKey {
        static let defaultValue: SegmentedItem? = nil
    }
    var itemSegment: SegmentedItem? {
        get { self[SegmentedItemKey.self] }
        set { self[SegmentedItemKey.self] = newValue }
    }
    
    struct BackgroundColorKey: EnvironmentKey {
        static let defaultValue: Color? = nil
    }
    var drawerBackgroundColor: Color? {
        get { self[BackgroundColorKey.self] }
        set { self[BackgroundColorKey.self] = newValue }
    }
    
    struct LenseColorKey: EnvironmentKey {
        static let defaultValue: Color? = nil
    }
    var lenseColor: Color? {
        get { self[LenseColorKey.self] }
        set { self[LenseColorKey.self] = newValue }
    }
}
