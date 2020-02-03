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
                if false {
                    HomeMainFilterFocused()
                }
                
                Group {
//                    VStack {
//                        Spacer().frame(maxHeight: homeState.showFilters ? .infinity : 0)
//
//                        HStack(spacing: 12) {
//                            HStack {
//                                FilterButton(label: "Dish", action: filterAction, flex: true)
//                                    .environment(\.colorScheme, .dark)
//                                FilterButton(label: "Craving", action: filterAction, flex: true)
//                                FilterButton(label: "Cuisine", action: filterAction, flex: true)
//                            }
//                            .cornerRadius(80)
//                            .shadow(radius: 10)
//
//                            FilterButton(label: "💵", action: {
//                                self.homeState.showFilters = true
//                            }, flex: true)
//                                .frame(width: 60)
//                                .cornerRadius(80)
//                                .shadow(radius: 10)
//                        }
//                        .padding(.vertical, 4)
//                        .padding(.horizontal, 20)
//                        .environment(\.colorScheme, .light)
//                    }
//                    .padding(.bottom, homeState.showFilters ? 40 : 0)
//                    .animation(.spring())
                    
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 10) {
                            Group {
                                Group {
                                    if self.showCuisine {
                                       FilterButton(width: 50, label: "Cuisine", action: { self.showCuisine = !self.showCuisine })
                                    } else {
                                       FilterButton(width: 50, label: "Dish", action: { self.showCuisine = !self.showCuisine })
                                    }
                                    
                                }
                                    .environment(\.colorScheme, .dark)
                                
                                FilterButton(label: "Price", action: {})
                                
                                FilterButton(label: "Spice", action: {})
                                
                                FilterButton(label: "Diet", action: {})
                                
                                FilterButton(label: "Hole in the Wall", action: filterAction)
                                    .opacity(0.8)
                                
                                FilterButton(label: "Open Late", action: filterAction)
                                    .opacity(0.8)
                            }
                            .animation(.spring())
                        }
                        .padding(.vertical, 12)
                        .padding(.horizontal, 24)
                        .environment(\.colorScheme, .light)
                    }
                    
//                    if showFilters == .search {
//                        ScrollView(.horizontal, showsIndicators: false) {
//                            HStack {
//                                leftPad
//                                HomeMainFilterBarTag()
//                            }
//                            .padding()
//                            .environment(\.colorScheme, .dark)
//                        }
//
//                    }
//
//                    if showFilters == .cuisine {
//                        ScrollView(.horizontal, showsIndicators: false) {
//                            HStack {
//                                leftPad
//                                HomeMainFilterBarCuisine()
//                            }
//                            .padding()
//                            .environment(\.colorScheme, .light)
//                        }
//                    }
//
//                    if showFilters != .overview {
//                        CustomButton(action: {
//                            self.showFilters = self.showFilters == .cuisine ? .search : .cuisine
//                        }) {
//                            Text(self.showFilters == .cuisine ? "🍽" : "🔍")
//                                .font(.system(size: 28))
//                            //                            .frame(width: 24, height: 24)
//                        }
//                        .offset(x: 20)
//                    }
                }
                .animation(.spring(response: 0.25))
                .transition(.slide)
            }
            
            // cover right part of filters so its untouchable and doesnt conflict with side drags
//            HStack {
//                Spacer()
//                Color.black.opacity(0.0001).frame(width: 35, height: 55)
//            }
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
        let schemeOppositeColor = Color(colorScheme == .dark ? .init(white: 0.95, alpha: 0.9) : .init(white: 0.15, alpha: 0.9))
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


