import SwiftUI

fileprivate let leftPad = AnyView(Spacer().frame(width: 50))

struct HomeMainFilterBar: View {
    @Environment(\.colorScheme) var colorScheme
    @EnvironmentObject var store: AppStore
    @State var wasOnSearchResults = false
    @State var x = true
    
    var body: some View {
        ZStack {
            SideEffect("HomeMainFilters.changeWasOnSearchResults",
               condition: { !self.wasOnSearchResults && Selectors.home.isOnSearchResults() }
            ) {
                self.wasOnSearchResults = true
            }
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    Group {
                        Color.white.opacity(0.1).frame(width: 1)
                        
                        ForEach(self.store.state.home.filters) { filter in
                            FilterButton(
                                label: filter.name,
                                fontSize: filter.fontSize,
                                active: filter.active,
                                action: {}
                            )
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
    @Environment(\.colorScheme) var colorScheme
    
    func body(content: Content) -> some View {
        let themeColor = Color(.systemBackground).opacity(0.85)
        let schemeOppositeColor = Color(
            colorScheme == .dark ? .init(white: 0.95, alpha: 1) : .init(white: 0.08, alpha: 1)
        )

        return content
            .foregroundColor(themeColor)
            .padding(.horizontal, 10)
            .background(schemeOppositeColor)
            .cornerRadius(20)
            .shadow(radius: 4)
    }
}

struct FilterButton: View {
    @Environment(\.colorScheme) var colorScheme
    var width: CGFloat? = nil
    var label: String = ""
    var fontSize: CGFloat = 15
    var icon: String = ""
    var active: Bool = false
    var action: (() -> Void)? = nil
    var flex: Bool = false
    var cornerRadiusCorners: UIRectCorner = .allCorners
    
    var height: CGFloat {
        App.filterBarHeight - App.filterBarPad * 2
    }
    
    var body: some View {
        
        return ZStack {
            DishButton(action: action ?? {}) {
                HStack {
                    Spacer()
                    if icon != "" {
                        Image(systemName: icon)
                            .resizable()
                            .scaledToFit()
                            .frame(width: self.height * 0.6, height: self.height * 0.6)
                    }
                    ZStack {
                        if label != "" {
                            Text(label)
                                .font(.system(size: fontSize))
                                .lineLimit(nil)
                                .fixedSize()
                        }
                    }
                    Spacer()
                }
                .frame(width: self.width, height: self.height)
                .modifier(FilterButtonStyle())
            }
            .environment(\.colorScheme,
                self.active
                    ? colorScheme == .light ? .dark : .light
                    : colorScheme
            )
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
