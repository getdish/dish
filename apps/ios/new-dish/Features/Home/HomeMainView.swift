import SwiftUI

class HomeViewState: ObservableObject {
    @Published var appHeight: CGFloat = 0
    @Published var scrollY: CGFloat = 0
    @Published var searchY: CGFloat = 0
    @Published var dragY: CGFloat = 0
    
    var mapHeight: CGFloat {
        let height = isSnappedToBottom
            ? appHeight - 130
            : appHeight - Constants.homeInitialDrawerHeight + y - scrollY
        return height.rounded()
    }
    
    var isSnappedToBottom: Bool {
        searchY + dragY > 100
    }
    
    var y: CGFloat {
        searchY + dragY
    }
    
    func finishDrag() {
        self.searchY = self.dragY + self.searchY
        self.dragY = 0
    }
    
    func toggleMap() {
        if isSnappedToBottom {
            self.dragY = 0
            self.searchY = 0
        } else {
            self.dragY = 110
        }
    }
}

fileprivate let cardRowHeight: CGFloat = 160

struct HomeMainView: View {
    @Environment(\.colorScheme) var colorScheme
    @EnvironmentObject var store: AppStore
    @Environment(\.geometry) var appGeometry
    @ObservedObject var state = HomeViewState()
    @State var searchBarMinY: CGFloat = 0
    @State var searchBarMaxY: CGFloat = 0
    @State var isDragging = false
    @State var showTypeMenu = false
    
    func isWithinSearchBar(_ valueY: CGFloat) -> Bool {
        return valueY >= searchBarMinY && valueY <= searchBarMaxY
    }
    
    var body: some View {
        // pushed map below the border radius of the bottomdrawer
        let isOnSearchResults = self.store.state.homeState.count > 1
        let state = self.state
        
        print("STATE scrollY \(state.scrollY) y \(state.y) dishMapHeight \(state.mapHeight)")
        
        return GeometryReader { geometry in
            ZStack {
                Color.black.frame(maxWidth: .infinity, maxHeight: .infinity)
                    .onAppear {
                        if let g = self.appGeometry {
                            state.appHeight = g.size.height
                        }
                    }
                
                VStack {
                    ZStack {
                        MapView(
                            width: geometry.size.width,
                            height: Screen.height,
                            darkMode: self.colorScheme == .dark
                        )
                        HomeMapControls()
                    }
                    .frame(height: state.mapHeight)
                    .cornerRadius(20)
                    .clipped()
                    
                    Spacer()
                }
                
                VStack {
                    Spacer().frame(height: state.mapHeight - cardRowHeight)
                    
                    ZStack {
                        // home
                        HomeCards(isHorizontal: self.state.isSnappedToBottom)
                            .offset(y: isOnSearchResults ? Screen.height : 0)
                            .animation(.spring())
                        
                        // pages as you drill in below home
                        if isOnSearchResults {
                            ForEach(1 ..< self.store.state.homeState.count) { index in
                                HomeSearchResults(
                                    state: self.store.state.homeState[index],
                                    height: Screen.height - state.mapHeight - 120
                                )
                                    .offset(y: 40)
                            }
                        }
                    }
                    .clipped()
                }
                
                VStack {
                    Spacer().frame(height: state.mapHeight + 31)
                    // filters
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack {
                            Text("🍽")
                                .font(.system(size: 32))
                                .padding(.horizontal, 2)
                                .onTapGesture {
                                    self.showTypeMenu = true
                                }
                                .sheet(
                                    isPresented: self.$showTypeMenu
                                ) { Text("Popover") }
                                
                            Spacer().frame(width: 10)
                            FilterButton(label: "American", action: {})
                            FilterButton(label: "Thai", action: {})
                            FilterButton(label: "Chinese", action: {})
                            FilterButton(label: "Italian", action: {})
                            FilterButton(label: "French", action: {})
                            FilterButton(label: "Burmese", action: {})
                            FilterButton(label: "Greek", action: {})
                        }
                        .padding(.horizontal)
                    }
                    Spacer()
                }
                .offset(y: isOnSearchResults ? -100 : 0)
                .opacity(isOnSearchResults ? 0 : 1)
                
                VStack {
                    GeometryReader { searchBarGeometry -> SearchBar in
                        if !self.isDragging {
                            DispatchQueue.main.async {
                                let frame = searchBarGeometry.frame(in: .global)
                                print("update search bar \(frame.minY) \(frame.maxY)")
                                if frame.minY != self.searchBarMinY {
                                    self.searchBarMinY = frame.minY
                                }
                                if frame.maxY != self.searchBarMaxY {
                                    self.searchBarMaxY = frame.maxY
                                }
                            }
                        }
                        return SearchBar()
                    }
                    .frame(height: 45)
                    Spacer()
                }
                .padding(.horizontal, 10)
                .offset(y: state.mapHeight - 23)
            }
            .clipped()
            .shadow(color: Color.black.opacity(0.25), radius: 20, x: 0, y: 0)
            .simultaneousGesture(
                DragGesture()
                    .onChanged { value in
                        // why is this off 80???
                        if self.isWithinSearchBar(value.location.y - 40) || self.isDragging {
                            self.isDragging = true
                            self.state.dragY = value.translation.height
                        }
                }
                .onEnded { value in
                    self.isDragging = false
                    self.state.finishDrag()
                }
            )
        }
        .environmentObject(self.state)
    }
}

struct SearchBar: View {
    @State var searchText = ""
    @State var scrollAtTop = true
    @EnvironmentObject var homeState: HomeViewState
    
    var body: some View {
        ZStack {
            SearchInput(
                placeholder: "Pho, Burger, Wings...",
                inputBackgroundColor: Color.white,
                borderColor: Color.gray.opacity(0.14),
                scale: self.scrollAtTop ? 1.25 : 1.0,
                sizeRadius: 2.0,
                searchText: self.$searchText
            )
            
            HStack {
                Spacer()
                HStack {
                    Image(systemName: "arrow.up.and.down.circle.fill")
                        .resizable()
                        .frame(width: 26, height: 26)
                        .padding(4)
                        .opacity(0.45)
                        .onTapGesture {
                            self.homeState.toggleMap()
                            
                    }
                }
                .cornerRadius(40)
            }
            .padding(.horizontal, 6)
        }
    }
}


struct FilterButton: View {
    var label: String
    var action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(label)
                .foregroundColor(Color.white.opacity(0.85))
                .font(.system(size: 14))
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 12)
        .background(Color.gray.opacity(0.2))
        .overlay(
            RoundedRectangle(cornerRadius: 80)
                .stroke(Color.white.opacity(0.7), lineWidth: 1)
        )
            .cornerRadius(80)
            .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 8)
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


struct HomeCards: View {
    var isHorizontal: Bool
    
    var content: some View {
        if isHorizontal {
            return AnyView(HomeCardsRow())
        } else {
            return AnyView(HomeCardsGrid())
        }
    }
    
    var body: some View {
        VStack {
            self.content
            Spacer()
        }
        .frame(minWidth: Screen.width, maxHeight: .infinity)
    }
}

struct HomeCardsGrid: View {
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var homeState: HomeViewState
    
    let items = features.chunked(into: 2)
    
    var content: some View {
        VStack(spacing: 10) {
            ForEach(0 ..< self.items.count) { index in
                HStack(spacing: 10) {
                    ForEach(self.items[index]) { item in
                        DishBrowseCard(landmark: item)
                            .frame(height: 200)
                            .onTapGesture {
                                print("tap on item")
                                self.store.send(
                                    .pushHomeState(HomeState(search: item.name))
                                )
                        }
                    }
                }
            }
        }
        .padding(.horizontal)
        .frame(width: Screen.width)
    }
    
    var initY = 0
    
    var body: some View {
        VStack {
            Spacer().frame(height: cardRowHeight)
            ScrollView {
                VStack(spacing: 0) {
                    ScrollListener(onScroll: { frame in
                        let frameY = self.homeState.mapHeight
                        let scrollY = frame.minY
                        let realY = frameY - scrollY - 44
                        let y = max(0, min(100, realY)).rounded()
                        if y != self.homeState.scrollY {
                            // attempting to have a scroll effect but its complex...
                            print("set now to \(y) ....... frameY \(frameY), scrollY = \(scrollY)")
//                            self.homeState.scrollY = y
                        }
                    })

                    Spacer().frame(height: 70)
                    self.content
                }
            }
        }
    }
}

struct ScrollListener: View {
    var onScroll: ((CGRect) -> Void)? = nil
    var body: some View {
        Color.clear
            .frame(height: 0)
            .overlay(
                GeometryReader { geometry -> Color in
                    if let cb = self.onScroll {
                        cb(geometry.frame(in: .global))
                    }
                    return Color.clear
                }
        )
    }
}

struct HomeCardsRow: View {
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack {
                ForEach(features) { item in
                    DishBrowseCard(landmark: item)
                        .frame(width: 100, height: cardRowHeight - 40)
                }
            }
            .padding(.horizontal)
        }
    }
}

struct DishBrowseCard: View {
    var landmark: Landmark
    var body: some View {
        FeatureCard(landmark: landmark)
            .cornerRadius(14)
    }
}

#if DEBUG
struct HomeMainView_Previews: PreviewProvider {
    static var previews: some View {
        HomeMainView()
            .embedInAppEnvironment(Mocks.homeSearchedPho)
    }
}
#endif
