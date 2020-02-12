import SwiftUI

fileprivate let leftPad = AnyView(Spacer().frame(width: 50))

struct HomeMainFilterBar: View {
    @Environment(\.colorScheme) var colorScheme
    @EnvironmentObject var store: AppStore
    @State var wasOnSearchResults = false
    
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
//                        CustomButton2(action: {  }) {
//                           Text("🔥")
//                                .font(.system(size: 24))
//                        }
                        
//                        Color.white.opacity(0.1).frame(width: 1)
//                                Image(systemName: "line.horizontal.3.decrease.circle")
//                                    .foregroundColor(.white)
//                                    .opacity(0.3)
                        
                        FilterButton(label: "$", fontSize: 20, action: {})
                            .frame(width: 50)
                        FilterButton(label: "$$", fontSize: 18, action: {})
                            .frame(width: 60)
                        FilterButton(label: "$$$", fontSize: 14, action: {})
                            .frame(width: 64)
                        
                        Color.white.opacity(0.1).frame(width: 1)
                        
                        FilterButton(label: "🚗", fontSize: 15, action: {})
                            .frame(width: 52)
                        
                        FilterButton(label: "Open Now", fontSize: 15, action: {})
                            .frame(width: 110)
                            .environment(\.colorScheme, colorScheme == .light ? .dark : .light)
                        
                        FilterButton(label: "Healthy", fontSize: 15, action: {})
                        
                        FilterButton(label: "Cash Only", fontSize: 15, action: {})
                            .frame(width: 110)
                    }
                }
                .padding(.vertical, App.filterBarPad)
                .padding(.horizontal, 24)
            }
        }
        .frame(height: App.filterBarHeight)
    }
}

fileprivate let filterAction = {
    // todo move this into action
    let curState = App.store.state.home.viewStates.last!
    let filters = curState.filters.filter({ $0.type == .cuisine }) + [
        SearchFilter(type: .cuisine, name: "American")
    ]
    App.store.send(.home(.push(HomeStateItem(
        search: curState.search,
        filters: filters
    ))))
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
    var action: () -> Void
    var flex: Bool = false
    var cornerRadiusCorners: UIRectCorner = .allCorners
    
    var height: CGFloat {
        App.filterBarHeight - App.filterBarPad * 2
    }
    
    var body: some View {
        
        return ZStack {
            DishButton(action: action) {
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
                        }
                    }
                    Spacer()
                }
                .frame(width: self.width, height: self.height)
                .modifier(FilterButtonStyle())
            }
        }
    }
}


struct FilterButtonStrong: View {
    var label: String
    var action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(label)
                .foregroundColor(.white)
                .fontWeight(.semibold)
                .font(.system(size: 14))
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 12)
        .background(Color.blue.opacity(0.35))
        .overlay(
            RoundedRectangle(cornerRadius: 80)
                .stroke(Color.white, lineWidth: 1)
        )
            .cornerRadius(80)
            .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 8)
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

struct HomeMainFilterBarCuisine: View {
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        Group {
            FilterButton(label: "American", action: filterAction)
            FilterButton(label: "Thai", action: filterAction)
            FilterButton(label: "Chinese", action: filterAction)
            FilterButton(label: "Italian", action: filterAction)
            FilterButton(label: "French", action: filterAction)
            FilterButton(label: "Burmese", action: filterAction)
            FilterButton(label: "Greek", action: filterAction)
        }
    }
}

struct FilterPicker<Content>: View where Content: View {
    @Binding var selection: Int
    var content: Content
    
    init(selection: Binding<Int>, @ViewBuilder content: @escaping () -> Content) {
        self._selection = selection
        self.content = content()
    }
    
    var body: some View {
        ZStack {
            // animated current selection
            Color.white
                .frame(width: 50)
                .cornerRadius(100)
            
            HStack {
                content
            }
            .padding(3)
        }
        .modifier(FilterButtonStyle())
    }
}
