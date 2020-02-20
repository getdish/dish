import SwiftUI

struct HomeMainFilterBar: View {
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
    
    var body: some View {
        ZStack {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(0 ..< self.filterGroups.count) { index in
                        Group {
                            FilterGroupView(group: self.filterGroups[index])
                            // separator
                            if index < self.filterGroups.count - 1 {
                                Color(white: 0.5).opacity(0.1).frame(width: 1)
                            }
                        }
                    }
                }
                .padding(.vertical, App.filterBarPad)
                .padding(.horizontal, 24)
            }
        }
        .frame(height: App.filterBarHeight)
    }
}

struct FilterGroupView: View {
    var group: [FilterItem]
    @State var isExpanded = false
    @State var widthById = [String: CGFloat]()
    var spacing: CGFloat = 10
    
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
        
        return FilterButton(filter: filter)
            .frame(width: isExpanded ? self.widths[index] : nil)
            .onGeometryChange { geometry in
                if !self.isExpanded {
                    let width = geometry.size.width
                    if width != self.widthById[filter.id] {
                        self.widthById[filter.id] = width
                    }
                }
            }
            .opacity(isExpanded || index == 0 ? 1 : 0)
            .offset(x: xOffset)
            .zIndex(Double(self.group.count - index))
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
    
    var filter: FilterItem
    var height: CGFloat {
        App.filterBarHeight - App.filterBarPad * 2
    }
    
    var body: some View {
        ZStack {
            DishButton(action: {
                if self.filter.type == .toggle {
                    App.store.send(.home(.setFilterActive(filter: self.filter, val: !self.filter.active)))
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
                .modifier(FilterButtonStyle(active: self.filter.active))
            }
        }
    }
}

struct FilterButtonStyle: ViewModifier {
    var active = false
    @Environment(\.colorScheme) var colorScheme
    
    func body(content: Content) -> some View {
        let a = Color.white
        let b = Color(white: 0.2)
        let bg = active ? a : b
        let fg = active ? b : a
        return content
            .foregroundColor(fg)
            .padding(.horizontal, 10)
            .background(bg)
            .cornerRadius(20)
            .shadow(radius: 4)
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
