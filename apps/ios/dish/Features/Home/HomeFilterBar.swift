import SwiftUI

fileprivate let leftPad = AnyView(Spacer().frame(width: 50))

struct HomeMainFilterBar: View {
    @Environment(\.colorScheme) var colorScheme
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
                        HStack(spacing: 10) {
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
                    }
                    .frame(height: App.filterBarHeight)
                }
                .animation(.spring(response: 0.25))
                .transition(.slide)
            }
        }
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
        let themeColor = Color(.systemBackground).opacity(0.85)
        let schemeOppositeColor = Color(
            colorScheme == .dark ? .init(white: 0.95, alpha: 1) : .init(white: 0.08, alpha: 1)
        )
        return ZStack {
            CustomButton2(action: action) {
                HStack {
                    Text(label)
                        .foregroundColor(schemeOppositeColor)
                        .font(.system(size: 15))
                        .lineLimit(1)
                }
                .frame(width: self.width, height: App.filterBarHeight - App.filterBarPad * 2)
                .padding(.horizontal, 12)
                .background(themeColor)
                .cornerRadius(12)
                .shadow(radius: 4)
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
