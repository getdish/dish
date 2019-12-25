import SwiftUI

fileprivate let bottomNavHeight: CGFloat = 115
fileprivate let filterBarHeight: CGFloat = 82

// used in search results for now...
let cardRowHeight: CGFloat = 140

class HomeViewState: ObservableObject {
    enum DragState { case on, idle, off }
    
    @Published var dragState: DragState = .idle
    @Published var appHeight: CGFloat = 0
    @Published var scrollY: CGFloat = 0
    @Published var y: CGFloat = 0
    @Published var searchBarYExtra: CGFloat = 0
    
    var mapInitialHeight: CGFloat {
        appHeight * 0.3
    }
    
    var mapHeight: CGFloat {
        return max(mapInitialHeight + y, 100)
    }
    
    var snapToBottomAt: CGFloat {
        appHeight * 0.15
    }
    
    var snappedToBottomMapHeight: CGFloat {
        appHeight - 200
    }
    
    var isSnappedToBottom: Bool {
        y > snapToBottomAt
    }
    
    func toggleMap() {
        self.snapToBottom(!isSnappedToBottom)
    }
    
    private var startDragAt: CGFloat = 0
    
    func drag(_ dragYInput: CGFloat) {
        // prevent dragging too far up if not at bottom
        let dragY = !isSnappedToBottom ? max(-100, dragYInput) : dragYInput
        // remember where we started
        if dragState != .on {
            self.startDragAt = y
        }
        let y = self.startDragAt + (
            // add resistance if snapped to bottom
            isSnappedToBottom ? dragY * 0.5 : dragY
        )
        // make the searchbar move a little more
        if isSnappedToBottom {
            self.searchBarYExtra = dragY * 0.25
        }
        let wasSnappedToBottom = isSnappedToBottom
        self.y = y
        let willSnapUp = -dragY > snapToBottomAt
        let willSnapDown = !wasSnappedToBottom && isSnappedToBottom
        if willSnapDown {
            self.snapToBottom(true)
        } else if willSnapUp {
            self.snapToBottom(false)
        } else {
            self.dragState = .on
        }
    }
    
    func finishDrag() {
        if isSnappedToBottom {
            self.snapToBottom()
        }
        self.dragState = .idle
    }
    
    func snapToBottom(_ toBottom: Bool = true) {
        print("snapToBottom \(toBottom)")
        self.dragState = .off
        withAnimation(.spring()) {
            self.searchBarYExtra = 0
            if toBottom {
                self.y = snappedToBottomMapHeight - mapInitialHeight
            } else {
                self.y = 0
            }
        }
    }
    
    func debugString() -> String {
        // xcode bug cant do live preview with this uncommented
        ""
//        return """
//        isSnappedToBottom \(self.isSnappedToBottom)
//        dragY \(self.y.rounded())
//        scrollY \(self.scrollY.rounded())
//        y \(self.y.rounded())
//        dishMapHeight \(self.mapHeight.rounded())
//        """
    }
}

fileprivate let homeViewState = HomeViewState()

struct HomeMainView: View {
    @Environment(\.colorScheme) var colorScheme
    @EnvironmentObject var store: AppStore
    @Environment(\.geometry) var appGeometry
    @ObservedObject var state = homeViewState
    @State var searchBarMinY: CGFloat = 0
    @State var searchBarMaxY: CGFloat = 0
    @State var showTypeMenu = false
    
    func isWithinSearchBar(_ valueY: CGFloat) -> Bool {
        return valueY >= searchBarMinY && valueY <= searchBarMaxY
    }
    
    var body: some View {
        // pushed map below the border radius of the bottomdrawer
        let isOnSearchResults = AppStateSelect.isOnSearchResults(self.store.state)
        let state = self.state
        let dragState = state.dragState
        let mapHeight = isOnSearchResults ? 160 : state.mapHeight
        
        // indicates were dragging
//            state.isSnappedToBottom && dragState != .off
//            ? -state.y / 2
//            : 0
        
//        print("RENDER \(state.debugString())")
        
        return GeometryReader { geometry in
            ZStack {
                Color.black
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
                    .frame(height: mapHeight)
                    .cornerRadius(20)
                    .clipped()
                    .animation(.spring(response: 0.3333))
                    
                    Spacer()
                }
                
                // everything below the map
                ZStack {
                    VStack {
                        Spacer()
                            .frame(height: mapHeight - cardRowHeight)
                        
                        HomeMainContent(
                            mapHeight: mapHeight,
                            isHorizontal: self.state.isSnappedToBottom
                        )
                    }
                    
                    VStack {
                        Spacer().frame(height: mapHeight + 31)
                        // filters
                        ZStack {
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack {
                                    Spacer().frame(width: 50)
                                    FilterButton(label: "American", action: {
                                        // todo move this into action
                                        let curState = self.store.state.homeState.last!
                                        let filters = curState.filters.filter({ $0.type == .cuisine }) + [
                                            SearchFilter(type: .cuisine, name: "American")
                                        ]
                                        self.store.send(.pushHomeState(
                                            HomeState(
                                                search: curState.search,
                                                dish: curState.dish,
                                                filters: filters
                                            )
                                        ))
                                    })
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
                                ContextMenuView(menuContent: {
                                    List {
                                        Text("Item One")
                                        Text("Item Two")
                                        Text("Item Three")
                                    }
                                    .frame(height: 150) // todo how to get lists that shrink
                                }) {
                                    Text("🍽")
                                        .font(.system(size: 32))
                                        .padding(.horizontal, 2)
                                        .onTapGesture {
                                            self.showTypeMenu = true
                                    }
                                }
                                Spacer()
                            }
                            .padding(.horizontal)
                        }
                        .animation(.spring(response: 0.3333))
                        
                        Spacer()
                    }
                    .offset(y: isOnSearchResults ? -100 : 0)
                    .opacity(isOnSearchResults ? 0 : 1)
                    
                    // keyboard dismiss
                    //                    Color.black.opacity(0.0001)
                    
                    VStack {
                        GeometryReader { searchBarGeometry -> HomeSearchBar in
                            if dragState != .on {
                                DispatchQueue.main.async {
                                    let frame = searchBarGeometry.frame(in: .global)
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
                    .offset(y: mapHeight - 23 + state.searchBarYExtra)
//                    .animation(dragState != .on ? .spring() : .none)
                        // searchinput always light
                        .environment(\.colorScheme, .light)
                }
                    // everything below map is always dark
                    .environment(\.colorScheme, .dark)
            }
            .clipped()
            .shadow(color: Color.black.opacity(0.25), radius: 20, x: 0, y: 0)
            .simultaneousGesture(
                DragGesture(minimumDistance: 10)
                    .onChanged { value in
                        // disable drag on off
                        if dragState == .off {
                            return
                        }
                        // why is this off 80???
                        if self.isWithinSearchBar(value.startLocation.y - 40) || dragState == .on {
                            self.state.drag(value.translation.height)
                        }
                }
                .onEnded { value in
                    if dragState != .idle {
                        self.state.finishDrag()
                    }
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
    @Environment(\.geometry) var appGeometry
    
    let items = features.chunked(into: 2)
    let spacing: CGFloat = 6
    
    var content: some View {
        VStack(spacing: self.spacing) {
            ForEach(0 ..< self.items.count) { index in
                HStack(spacing: self.spacing) {
                    ForEach(self.items[index]) { item in
                        DishBrowseCard(dish: item)
                            .frame(width: (self.appGeometry?.size.width ?? Screen.width) / 2 - self.spacing * 2)
                            .onTapGesture {
                                print("tap on item")
                                self.store.send(
                                    .pushHomeState(HomeState(dish: item.name))
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
            ScrollView(showsIndicators: false) {
                VStack(spacing: 0) {
                    ScrollListener(onScroll: { frame in
                        if self.homeState.dragState == .idle {
                            let frameY = self.homeState.mapHeight
                            let scrollY = frame.minY
                            let realY = frameY - scrollY - 44
                            let y = max(0, min(100, realY)).rounded()
                            if y != self.homeState.scrollY {
                                // attempting to have a scroll effect but its complex...
                                print("scrollY \(y) ....... frameY \(frameY), scrollY = \(scrollY)")
                                //                            self.homeState.scrollY = y
                            }
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
                        .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 5)
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
        FeatureCard(dish: dish, aspectRatio: 1.4)
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
