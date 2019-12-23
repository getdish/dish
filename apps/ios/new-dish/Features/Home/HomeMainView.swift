import SwiftUI

fileprivate let bottomNavHeight: CGFloat = 115
fileprivate let filterBarHeight: CGFloat = 82
fileprivate let cardRowHeight: CGFloat = 160

class HomeViewState: ObservableObject {
    @Published var appHeight: CGFloat = 0
    @Published var scrollY: CGFloat = 0
    @Published var searchY: CGFloat = 0
    @Published var dragY: CGFloat = 0
    @Published var snappedToBottomMapHeight: CGFloat = 0
    
    var mapHeight: CGFloat {
        if isSnappedToBottom {
            return snappedToBottomMapHeight
        }
        let h = (appHeight - Constants.homeInitialDrawerHeight + y - scrollY).rounded()
        return max(h, 100)
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
    
    func drag(_ y: CGFloat) -> Bool {
        let wasSnappedToBottom = isSnappedToBottom
        self.dragY = y
        if !wasSnappedToBottom && isSnappedToBottom {
            self.snapToBottom(true)
            return true
        } else if !isSnappedToBottom && wasSnappedToBottom {
            self.snapToBottom(false)
        } else {
            self.snappedToBottomMapHeight = self.mapHeight
        }
        return false
    }
    
    func snapToBottom(_ atBottom: Bool) {
        withAnimation(.spring()) {
            if atBottom {
                self.snappedToBottomMapHeight = appHeight - 200
            } else {
                self.searchY = 0
                self.dragY = 0
            }
        }
    }
}

fileprivate let homeViewState = HomeViewState()

struct HomeMainView: View {
    enum DragState { case on, idle, off }
    
    @Environment(\.colorScheme) var colorScheme
    @EnvironmentObject var store: AppStore
    @Environment(\.geometry) var appGeometry
    @ObservedObject var state = homeViewState
    @State var searchBarMinY: CGFloat = 0
    @State var searchBarMaxY: CGFloat = 0
    @State var dragState: DragState = .idle
    @State var showTypeMenu = false
    
    func isWithinSearchBar(_ valueY: CGFloat) -> Bool {
        return valueY >= searchBarMinY && valueY <= searchBarMaxY
    }
    
    var body: some View {
        // pushed map below the border radius of the bottomdrawer
        let isOnSearchResults = self.store.state.homeState.count > 1
        let state = self.state
        let dragSearchResistY = state.isSnappedToBottom && self.dragState != .off ? -state.dragY / 2 : 0
        
        print("dragSearchResistY \(dragSearchResistY)")
        print("STATE scrollY \(state.scrollY) y \(state.y) dishMapHeight \(state.mapHeight)")
        print("home state \(self.store.state.homeState.count)")
        
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
                        //                        HomeMapControls()
                    }
                    .frame(height: state.mapHeight)
                    .cornerRadius(20)
                    .clipped()
                    
                    Spacer()
                }
                
                // everything below the map
                ZStack {
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
                        ZStack {
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack {
                                    Spacer().frame(width: 50)
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
                                Spacer()
                            }
                            .padding(.horizontal)
                        }
                        Spacer()
                    }
                    .offset(y: isOnSearchResults ? -100 : 0)
                    .opacity(isOnSearchResults ? 0 : 1)
                    
                    VStack {
                        GeometryReader { searchBarGeometry -> HomeSearchBar in
                            if self.dragState != .on {
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
                            return HomeSearchBar()
                        }
                        .frame(height: 45)
                        Spacer()
                    }
                    .padding(.horizontal, 10)
                    .offset(y: state.mapHeight - 23 - dragSearchResistY)
                    // searchinput always light
                    .environment(\.colorScheme, .light)
                }
                    // everything below map is always dark
                    .environment(\.colorScheme, .dark)
            }
            .clipped()
            .shadow(color: Color.black.opacity(0.25), radius: 20, x: 0, y: 0)
            .simultaneousGesture(
                DragGesture()
                    .onChanged { value in
                        // why is this off 80???
                        if self.isWithinSearchBar(value.location.y - 40) || self.dragState == .on {
                            let didSnap = self.state.drag(value.translation.height)
                            if didSnap {
                                // prevent any more dragging
                                self.dragState = .off
                            } else {
                                self.dragState = .on
                            }
                        }
                }
                .onEnded { value in
                    self.dragState = .idle
                    self.state.finishDrag()
                }
            )
        }
        .environmentObject(self.state)
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
                        DishBrowseCard(dish: item)
                            .frame(height: 180)
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
                    
                    Spacer().frame(height: filterBarHeight)
                    self.content
                    Spacer().frame(height: bottomNavHeight)
                }
            }
            .mask(
                LinearGradient(
                    gradient: .init(colors: [
                        Color.white.opacity(0),
                        Color.white.opacity(0),
                        Color.black,
                        Color.black,
                        Color.black,
                        Color.black,
                        Color.black,
                        Color.black,
                        Color.black,
                        Color.black,
                        Color.black,
                        Color.black,
                        Color.black,
                        Color.black,
                        Color.black
                    ]),
                    startPoint: .top,
                    endPoint: .bottom
                )
            )
        }
    }
}

struct HomeCardsRow: View {
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack {
                ForEach(features) { item in
                    DishBrowseCard(dish: item)
                        .frame(width: 100, height: cardRowHeight - 40)
                }
                
                Spacer().frame(height: bottomNavHeight)
            }
            .padding(.horizontal)
        }
    }
}

struct DishBrowseCard: View {
    var dish: DishItem
    var body: some View {
        FeatureCard(dish: dish, aspectRatio: 1)
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
