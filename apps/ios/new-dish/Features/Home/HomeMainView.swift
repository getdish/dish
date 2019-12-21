import SwiftUI

class HomeViewState: ObservableObject {
    @Published var scrollY: CGFloat = 0
    @Published var searchY: CGFloat = 0
    @Published var dragY: CGFloat = 0

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
    @Environment(\.geometry) var appGeometry
    @EnvironmentObject var store: AppStore
    @ObservedObject var state = HomeViewState()
    
    var body: some View {
        // pushed map below the border radius of the bottomdrawer
        let appHeight = appGeometry?.size.height ?? 100
        let dishMapHeight = state.isSnappedToBottom
            ? Screen.height - 120
            : appHeight - Constants.homeInitialDrawerHeight + state.y

        
//        let isOnSearchResults = self.store.state.homeState.count > 1
        let isOnSearchResults = false

        print("STATE y \(state.y) dishMapHeight \(dishMapHeight)")

        return GeometryReader { geometry in
            ZStack {
                Color.black.frame(maxWidth: .infinity, maxHeight: .infinity)
                
                VStack {
                    ZStack {
                        MapView(
                            width: geometry.size.width,
                            height: Screen.height,
                            darkMode: self.colorScheme == .dark
                        )
                        HomeMapControls()
                    }
                    .frame(height: dishMapHeight)
                    .cornerRadius(20)
                    .clipped()

                    Spacer()
                }
                
                VStack {
                    Spacer().frame(height: dishMapHeight - cardRowHeight)
                    
                    ZStack {
                        // home
                        HomeCards(isHorizontal: self.state.isSnappedToBottom)
                            .offset(y: isOnSearchResults ? Screen.height : 0)
                            .animation(.spring())

                        // pages as you drill in below home
                        if isOnSearchResults {
                            ForEach(0 ..< self.store.state.homeState.count) { index in
                                HomeSearchResults(
                                    state: self.store.state.homeState[index],
                                    height: Screen.height - dishMapHeight - 120
                                )
                                    .offset(y: 40)
                            }
                        }
                    }
                    .clipped()
                }
                
                VStack {
                    Spacer().frame(height: dishMapHeight + 35)
                    // filters
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack {
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
                .animation(.spring())
                
                VStack {
                    SearchBar()
                        .simultaneousGesture(
                            DragGesture()
                                .onChanged { value in
                                    self.state.dragY = value.location.y
                                    print("\(value.location.y) \(value.translation.height)")
                            }
                            .onEnded { value in
                                self.state.finishDrag()
                            }
                    )
                    Spacer()
                }
                    .padding(.horizontal, 10)
                    .offset(y: dishMapHeight - 23)
            }
            .clipped()
            .shadow(color: Color.black.opacity(0.25), radius: 20, x: 0, y: 0)
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
                .foregroundColor(.white)
                .font(.system(size: 14))
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 12)
        .background(Color.gray.opacity(0.2))
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

    var body: some View {
        VStack {
            Spacer().frame(height: cardRowHeight + 40)
            ScrollView {
                VStack(spacing: 0) {
                    Spacer().frame(height: 30)
                    GeometryReader { gg in
                        //                                self.scrollY = min(100, gg.frame(in: .global).minY - dishMapHeight)
                        return Spacer()
                    }
                    self.content
                }
            }
        }
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
