import SwiftUI

fileprivate let leftPad = AnyView(Spacer().frame(width: 50))

struct HomeMainFilterBar: View {
    @EnvironmentObject var store: AppStore
    @State var wasOnSearchResults = false
    @State var showCuisine = false
    
    var body: some View {
        ZStack {
            SideEffect("HomeMainFilters.changeWasOnSearchResults",
               condition: { !self.wasOnSearchResults && Selectors.home.isOnSearchResults() }
            ) {
                self.wasOnSearchResults = true
            }
            
            ZStack(alignment: .leading) {
//                if false {
//                    HomeMainFilterFocused()
//                }
                Group {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            Group {
                                FilterButton(label: "Price", action: {})
                                FilterButton(label: "Spice", action: {})
                                FilterButton(label: "Diet", action: {})
                                FilterButton(label: "Hidden Gem", action: filterAction)
                                FilterButton(label: "Lunch Spot", action: filterAction)
                                FilterButton(label: "Open Late", action: filterAction)
                            }
                            .animation(.spring())
                        }
                        .padding(.vertical, App.filterBarPad)
                        .padding(.horizontal, 24)
                        .environment(\.colorScheme, .light)
                    }
                    .frame(height: App.filterBarHeight)
                }
                .animation(.spring(response: 0.25))
                .transition(.slide)
            }
        }
    }
}

struct HomeMainFilterFocused: View {
    let items = features.chunked(into: 2)
    
    var body: some View {
        ZStack {
//            Color.white
            BlurView(style: .extraLight)
            
            VStack {
                ScrollView {
                    HStack {
                        Text("Filter: Dish")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                        
                        Spacer()
                    }
                    .padding(.top, 90)

                    VStack(spacing: 12) {
                        ForEach(0 ..< self.items.count) { index in
                            HStack(spacing: 12) {
                                ForEach(self.items[index]) { item in
                                    DishCardView(
                                        dish: item,
                                        at: .start,
                                        display: .full,
                                        height: 120,
                                        action: {
//                                            homeViewState.showFilters = false
                                        }
                                    )
                                    .equatable()
                                    .animation(.none)
                                }
                            }
                        }
                    }
                }
                .padding(.horizontal)
            }
        }
        .edgesIgnoringSafeArea(.all)
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

struct FilterButton: View {
    @Environment(\.colorScheme) var colorScheme
    var width: CGFloat? = nil
    var label: String
    var action: () -> Void
    var flex: Bool = false
    var cornerRadiusCorners: UIRectCorner = .allCorners
    
    var body: some View {
        let textColor = Color(.systemBackground).opacity(0.85)
        let schemeOppositeColor = Color(
            colorScheme == .dark ? .init(white: 0.95, alpha: 0.9) : .init(white: 0.08, alpha: 1)
        )
        let shadowColor = Color(.black).opacity(colorScheme == .light ? 0.6 : 0.3)
        let fontSize: CGFloat = 14
        return ZStack {
            CustomButton2(action: action) {
                HStack {
                    if flex {
                        Spacer()
                    }
                    Text(label)
                        .foregroundColor(textColor)
                        .font(.system(size: fontSize))
                        .lineLimit(1)
                    if flex {
                        Spacer()
                    }
                }
                .frame(width: self.width, height: App.filterBarHeight - App.filterBarPad * 2)
                .padding(.horizontal, 12)
                .background(schemeOppositeColor)
                .cornerRadius(100)
                    //                .cornerRadius(100, corners: self.cornerRadiusCorners)
                    .shadow(color: shadowColor, radius: 7, x: 0, y: 2)
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
