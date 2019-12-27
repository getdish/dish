import SwiftUI

fileprivate let filterBarHeight: CGFloat = 82
fileprivate let bottomNavHeight: CGFloat = 115

struct HomeCardsView: View {
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
                                    .home(
                                        .push(HomeStateItem(dish: item.name))
                                    )
                                )
                        }
                    }
                }
            }
        }
    }
    
    var initY = 0
    
    var body: some View {
        VStack {
            Spacer().frame(height: cardRowHeight)
            ScrollView(showsIndicators: false) {
                VStack(spacing: 0) {
                    ScrollListener(onScroll: { frame in
                        if HomeDragLock.lock == .idle {
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
