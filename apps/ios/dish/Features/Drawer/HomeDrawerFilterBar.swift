import SwiftUI

fileprivate let filterBarPad: CGFloat = 7

struct HomeDrawerFilterBar: View, Equatable {
  static func == (lhs: Self, rhs: Self) -> Bool {
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
  
  @State var x = false

  var body: some View {
    ZStack {
      ScrollView(.horizontal, showsIndicators: false) {
        HStack(spacing: 0) {
//          Text(x ? "🥂" : "🍽") //
//            .font(.system(size: 26))
//            .onTapGesture {
//              self.x = !self.x
//            }
//          .padding(.trailing, 4)
          
          FilterButton(
            filter: FilterItem(name: self.store.state.home.cuisineFilter, fontSize: 13),
            onTap: {
              self.store.send(.home(.toggleShowCuisineFilter))
            }
          )

          ForEach(0..<self.filterGroups.count) { index in
            Group {
              // separator
//              if self.filterGroups[index][0].stack == false
//                && index != 0
//              {
//                self.separator
//              }
              FilterGroupView(
                group: self.filterGroups[index]
              )
            }
          }
        }
          .padding(.horizontal, 24)
          // this heavily fixes map pan
          .drawingGroup()
      }
    }
      .animation(.none)
      .frame(height: App.filterBarHeight)
  }
}

struct SegmentedItem: Equatable {
  var isFirst = false
  var isMiddle = false
  var isLast = false
}

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
    Group {
      if self.group[0].stack {
        ZStack {
          ForEach(0..<self.group.count) { index in
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
      } else {
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
    let itemSegment = isExpanded && stacks
      ? SegmentedItem(
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
      .onGeometrySizeChange { size in
        if !self.isExpanded {
          if size.width != self.widthById[filter.id] {
            self.widthById[filter.id] = size.width
          }
        }
      }
      .opacity(isExpanded || index == 0 ? 1 : 0)
      .offset(x: xOffset)
      .animation(.spring(response: 0.3))
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
  @Environment(\.itemSegment) var itemSegment

  var expandable: Bool = false
  var filter: FilterItem
  var onTap: (() -> Void)? = nil

  var height: CGFloat {
    App.filterBarHeight - filterBarPad
  }

  var body: some View {
    DishButton(
      action: {
        if let cb = self.onTap {
          cb()
        } else {
          if self.filter.type == .toggle {
            App.store.send(.home(.setFilterActive(filter: self.filter, val: !self.filter.active)))
          } else {
            // TODO
          }
        }
      }
    ) {
      VStack {
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
      }
      .modifier(FilterButtonStyle(
        active: self.filter.active,
        pressed: false
      ))
        .padding(filterBarPad)
    }
  }
}

struct FilterButtonStyle: ViewModifier {
  var active = false
  var pressed = false
  @Environment(\.itemSegment) var itemSegment
  @Environment(\.lenseColor) var lenseColor
  @Environment(\.colorScheme) var colorScheme
  @State var display: SegmentedItem? = nil

  func body(content: Content) -> some View {
    let isLight = colorScheme == .light
    var fg: Color = isLight ? Color(white: 0) : Color.white.opacity(0.4)
    var bg = isLight ? Color(white: 0, opacity: 0.1) : Color.black.opacity(0.5)
    if active {
      fg = isLight ? Color.white : Color.white
      bg = isLight ? Color.black : Color(white: 0, opacity: 0.05)
    }
    let corners: [UIRectCorner] = itemSegment == nil
      || itemSegment?.isLast == true && itemSegment?.isFirst == true
      ? [.allCorners]
      : itemSegment?.isMiddle == true
      ? []
      : itemSegment?.isLast == true
      ? [.topRight, .bottomRight] : [.topLeft, .bottomLeft]
    
    let gradient: [Color] = [active ? bg : bg.opacity(0.05), .clear]
    return
      content
      .padding(.horizontal, 9)
      .background(bg)
      .foregroundColor(fg)
      .background(
        LinearGradient(
          gradient: Gradient(colors: pressed ? gradient.reversed() : gradient),
          startPoint: .top,
          endPoint: .trailing
        )
      )
      .cornerRadius(20, corners: .init(corners))
  }
}

#if DEBUG
  struct HomeMainFilters_Previews: PreviewProvider {
    static var previews: some View {
      HomeDrawerFilterBar()
        .embedInAppEnvironment()
    }
  }
#endif
