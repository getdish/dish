import SwiftUI

fileprivate let leftPad = AnyView(Spacer().frame(width: 50))

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
                    Group {
                        ForEach(0 ..< self.filterGroups.count) { index in
                            Group {
                                FilterGroupView(group: self.filterGroups[index])
                                Color.white.opacity(0.1).frame(width: 1)
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
    @State var isOpen = false
    @State var widths = [String: CGFloat]()
    
    var maxWidth: CGFloat {
        self.widths.compactMap { $0.value }.reduce(0) { max($0, $1) }
    }

    var body: some View {
        print("filter group -- \(self.maxWidth)")
        
        return Group {
            if self.group[0].stack {
                ZStack {
                    ForEach(0 ..< self.group.count) { index in
                        FilterButton(filter: self.group[index])
                            .onGeometryChange { geometry in
                                let width = geometry.size.width
                                let filter = self.group[index]
                                if width != self.widths[filter.id] {
                                    print("set width \(width)")
                                    self.widths[filter.id] = width
                                }
                            }
                            .offset(x: CGFloat(index * 10))
                            .zIndex(Double(self.group.count - index))
//                            .rotationEffect(.degrees(Double(-2 + index * 2)))
                    }
                }
                .frame(width: self.maxWidth > 0 ? self.maxWidth : nil)
            }
            else {
                ForEach(self.group) { filter in
                    FilterButton(filter: filter)
                        .offset(x: CGFloat(filter.stack ? -40 : 0))
                }
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

#if DEBUG
struct HomeMainFilters_Previews: PreviewProvider {
    static var previews: some View {
        HomeMainFilterBar()
            .embedInAppEnvironment()
    }
}
#endif
