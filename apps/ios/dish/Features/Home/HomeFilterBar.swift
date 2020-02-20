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
                                ForEach(self.filterGroups[index]) { filter in
                                    FilterButton(filter: filter)
                                }
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
