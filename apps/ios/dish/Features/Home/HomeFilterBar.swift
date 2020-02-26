import SwiftUI

fileprivate let filterBarPad: CGFloat = 12

struct HomeMainFilterBar: View, Equatable {
    static func == (lhs: HomeMainFilterBar, rhs: HomeMainFilterBar) -> Bool {
        true
    }
    
    @Environment(\.colorScheme) var colorScheme
    @EnvironmentObject var store: AppStore
    
    var filterGroups: [[FilterItem]] {
        var items: [[FilterItem]] = []
        var lastGroup = ""
        self.store.state.home.filters.forEach { filter in
            if lastGroup != filter.groupId {
                items.append([filter])
                lastGroup = filter.groupId
            } else {
                items[items.count - 1].append(filter)
            }
        }
        return items
    }
    
    var separator: some View {
        Color(white: 0.5).opacity(0.1).frame(width: 1)
    }
    
    var body: some View {
        ZStack {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    FilterButton(
                        filter: FilterItem(name: self.store.state.home.cuisineFilter),
                        onTap: {
                            self.store.send(.home(.toggleShowCuisineFilter))
                        }
                    )
                    
                    ForEach(0 ..< self.filterGroups.count) { index in
                        Group {
                            // separator
                            if self.filterGroups[index][0].stack == false
                                && index != 0 {
                                self.separator
                            }
                            FilterGroupView(
                                group: self.filterGroups[index]
                            )
                        }
                    }
                }
                .padding(.vertical, filterBarPad)
                .padding(.horizontal, 24)
                // this heavily fixes map pan
                .drawingGroup()
            }
        }
        .frame(height: App.filterBarHeight)
    }
}

struct SegmentedItem: Equatable {
    var isFirst = false
    var isMiddle = false
    var isLast = false
}

//struct GroupingPreferenceKey: PreferenceKey {
//    typealias Value = GroupingPreference
//    static var defaultValue: GroupingPreference = GroupingPreference()
//    static func reduce(value: inout GroupingPreference, nextValue: () -> GroupingPreference) {
//        value = nextValue()
//    }
//}

struct FilterGroupView: View {
    var group: [FilterItem]
    @State var isExpanded = false
    @State var widthById = [String: CGFloat]()
    var spacing: CGFloat = 0
    
    var widths: [CGFloat] {
        let calculated = self.widthById.compactMap { $0.value }
        if calculated.count > 0 {
            return calculated
        } else {
            return Array(0..<group.count).map { CGFloat($0) }
        }
    }
    
    var expandedWidth: CGFloat {
        self.widths.reduce(0) { $0 + $1 + self.spacing }
    }

    var body: some View {
        print("filterbar \(self.isExpanded) \(self.expandedWidth)")
        return Group {
            if self.group[0].stack {
                ZStack {
                    ForEach(0 ..< self.group.count) { index in
                        self.filterButtonGroup(index)
                    }
                }
                .frame(
                    width: self.isExpanded ? self.expandedWidth : self.widths[0],
                    alignment: .leading
                )
                .overlay(
                    self.overlayStack
                )
            }
            else {
                ForEach(self.group) { filter in
                    FilterButton(filter: filter)
                }
            }
        }
    }
    
    func filterButtonGroup(_ index: Int) -> some View {
        let isExpanded = self.isExpanded
        let filter = self.group[index]
        let xBefore: CGFloat = self.widths[0..<index].reduce(0) { $0 + $1 + self.spacing }
        let xOffset: CGFloat = isExpanded ? xBefore : 0
        let total = self.widths.count
        let stacks = filter.stack
        let itemSegment = isExpanded && stacks ?
            SegmentedItem(
                isFirst: index == 0,
                isMiddle: index < total - 1 && index > 0,
                isLast: index == total - 1
                )
            : SegmentedItem(
                isFirst: true,
                isMiddle: false,
                isLast: true
            )
        
        return FilterButton(expandable: index == 0 && !isExpanded, filter: filter)
            .frame(width: isExpanded ? self.widths[index] : nil)
            .onGeometrySizeChange { width, _ in
                if !self.isExpanded {
                    if width != self.widthById[filter.id] {
                        self.widthById[filter.id] = width
                    }
                }
            }
            .opacity(isExpanded || index == 0 ? 1 : 0)
            .offset(x: xOffset)
            .zIndex(Double(self.group.count - index))
            .environment(\.itemSegment, itemSegment)
    }
    
    var overlayStack: some View {
        Color.black.opacity(0.00001)
            .onTapGesture {
                self.isExpanded = !self.isExpanded
            }
            .allowsHitTesting(!self.isExpanded)
    }
}

struct FilterButton: View {
    @Environment(\.colorScheme) var colorScheme
    
    var expandable: Bool = false
    var filter: FilterItem
    var onTap: (() -> Void)? = nil
    var height: CGFloat {
        App.filterBarHeight - filterBarPad * 2
    }
    
    var body: some View {
        ZStack {
            DishButton(action: {
                if let cb = self.onTap {
                    cb()
                } else {
                    if self.filter.type == .toggle {
                        App.store.send(.home(.setFilterActive(filter: self.filter, val: !self.filter.active)))
                    } else {
                        // TODO
                    }
                }
            }) {
                HStack {
                    Spacer()
                    if self.filter.icon != nil {
                        Image(systemName: self.filter.icon!)
                            .resizable()
                            .scaledToFit()
                            .frame(width: self.height * 0.6, height: self.height * 0.6)
                    }
                    ZStack {
                        if self.filter.name != "" {
                            Text(self.filter.name)
                                .font(.system(size: self.filter.fontSize))
                                .fixedSize()
                        }
                    }
                    Spacer()
                }
                .frame(height: self.height)
                .modifier(FilterButtonStyle(
                    active: self.filter.active,
                    bordered: expandable
                ))
            }
        }
    }
}

struct FilterButtonStyle: ViewModifier {
    var active = false
    var bordered = false
    @Environment(\.itemSegment) var itemSegment
    @Environment(\.colorScheme) var colorScheme
    @State var display: SegmentedItem? = nil
    
    func body(content: Content) -> some View {
        let a = Color.black
        let b = Color(white: 0.9)
        let bg = active ? a : b
        let fg = active ? b : a
        let corners: [UIRectCorner] = itemSegment == nil || itemSegment?.isLast == true && itemSegment?.isFirst == true
            ? [.allCorners]
            : itemSegment?.isMiddle == true
                ? []
                    : itemSegment?.isLast == true
                    ? [.topRight, .bottomRight] : [.topLeft, .bottomLeft]
        return content
            .foregroundColor(bordered ? nil : fg)
            .padding(.horizontal, 8)
            .background(bg)
            .cornerRadius(20, corners: .init(corners))
    }
}

#if DEBUG
struct HomeMainFilters_Previews: PreviewProvider {
    static var previews: some View {
        HomeMainFilterBar()
            .embedInAppEnvironment()
    }
}
#endif
