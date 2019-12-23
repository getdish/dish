import SwiftUI

fileprivate let bottomNavHeight: CGFloat = 115
fileprivate let filterBarHeight: CGFloat = 82
fileprivate let cardRowHeight: CGFloat = 160

class HomeViewState: ObservableObject {
    enum DragState { case on, idle, off }

    @Published var dragState: DragState = .idle
    @Published var appHeight: CGFloat = 0
    @Published var scrollY: CGFloat = 0
    @Published var searchY: CGFloat = 0
    @Published var dragY: CGFloat = 0
    @Published var snappedToBottomMapHeight: CGFloat = 0
    
    var mapInitialHeight: CGFloat {
        appHeight * 0.3
    }

    var mapHeight: CGFloat {
        if isSnappedToBottom {
            return snappedToBottomMapHeight
        }
        return max(mapInitialHeight + y, 100)
    }
    
    var snapToBottomAt: CGFloat {
        appHeight * 0.1
    }
    
    var isSnappedToBottom: Bool {
        y > snapToBottomAt
    }
    
    var y: CGFloat {
        max(-100, searchY + dragY + scrollY)
    }

    func finishDrag() {
        self.searchY = self.dragY + self.searchY
        self.dragY = 0
        self.dragState = .idle
        // if they dragged a little and let go before snapping back up, reset
        if isSnappedToBottom {
            self.setSnappedToBottomY()
        }
    }
    
    func toggleMap() {
        if isSnappedToBottom {
            self.dragY = 0
            self.searchY = 0
        } else {
            self.dragY = 110
        }
    }
    
    func drag(_ y: CGFloat) {
        let wasSnappedToBottom = isSnappedToBottom
        self.dragY = y
        
        let willSnapDown = !wasSnappedToBottom && isSnappedToBottom
        let willSnapUp = !isSnappedToBottom && wasSnappedToBottom
        
        if willSnapUp || willSnapDown {
            print("SNAPPIN \(y) ----- down? \(willSnapDown)")
        }

        if willSnapDown {
            self.snapToBottom(true)
            self.dragState = .off
        } else if willSnapUp {
            self.snapToBottom(false)
            self.dragState = .off
        } else {
            self.snappedToBottomMapHeight = self.mapHeight
            self.dragState = .on
        }
    }
    
    func snapToBottom(_ toBottom: Bool) {
        withAnimation(.spring()) {
            // then animate
            if toBottom {
                self.snappedToBottomMapHeight = appHeight - 200
                self.setSnappedToBottomY()
            } else {
                self.searchY = snapToBottomAt - 1
                self.dragY = 0
            }
        }
    }
    
    func setSnappedToBottomY() {
        // were saying, you need to drag it 100px before it snaps back up
        self.searchY = snapToBottomAt + 100
        self.dragY = 0
    }
    
    func debugString() -> String {
        """
        dragY \(self.dragY.rounded())
        searchY \(self.searchY.rounded())
        scrollY \(self.scrollY.rounded())
        y \(self.y.rounded())
        dishMapHeight \(self.mapHeight.rounded())
        """
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
        let isOnSearchResults = self.store.state.homeState.count > 1
        let state = self.state
        let dragState = state.dragState
        
        // indicates were dragging
        let searchDragExtraY = state.isSnappedToBottom && dragState != .off
            ? -state.dragY / 2
            : 0
        
        print("RENDER \(state.debugString())")
        
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
                    .offset(y: state.mapHeight - 23 - searchDragExtraY)
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
                        DispatchQueue.main.async {
                            // disable drag on off
                            if state.dragState == .off {
                                return
                            }
                            // why is this off 80???
                            if self.isWithinSearchBar(value.location.y - 40) || dragState == .on {
                                self.state.drag(value.translation.height)
                            }
                        }
                }
                .onEnded { value in
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
    @Environment(\.geometry) var appGeometry
    
    let items = features.chunked(into: 2)
    let spacing: CGFloat = 10
    
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
                            print("scrollY \(y) ....... frameY \(frameY), scrollY = \(scrollY)")
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
        FeatureCard(dish: dish, aspectRatio: 1.2)
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
