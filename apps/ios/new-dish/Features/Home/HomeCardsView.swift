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
    let spacing: CGFloat = 10
    
    var content: some View {
        VStack(spacing: self.spacing) {
            ForEach(0 ..< self.items.count) { index in
                HStack(spacing: self.spacing) {
                    ForEach(self.items[index]) { item in
                        DishGridCard(dish: item)
                            .frame(width: (self.appGeometry?.size.width ?? Screen.width) / 2 - self.spacing * 2)
                            .onTapGesture {
                                print("tap on item")
                                self.store.send(
                                    .home(
                                        .push(HomeStateItem(filters: [SearchFilter(name: item.name)]))
                                    )
                                )
                        }
                    }
                }
            }
        }
    }
    
    @State var initY: CGFloat = 0
    
    var body: some View {
        VStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: 0) {
                    ScrollListener(onScroll: { frame in
                        if self.initY == 0 {
                            DispatchQueue.main.async {
                                self.initY = frame.minY
                            }
                        }
                        if HomeDragLock.state == .idle {
                            let scrollY = frame.minY
                            let y = self.initY - scrollY
                            self.homeState.setScrollY(y)
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

struct DishGridCard: View {
    var dish: DishItem
    var body: some View {
        FeatureCard(dish: dish, aspectRatio: 1.4, at: .start)
            .cornerRadius(14)
    }
}

struct HomeCardsRow: View {
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack {
                ForEach(features) { item in
                    DishRowCard(dish: item)
                        .frame(width: 160, height: cardRowHeight - 40)
                        .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 5)
                }
                
                Spacer().frame(height: bottomNavHeight)
            }
            .padding(.horizontal)
        }
    }
}

struct DishRowCard: View {
    var dish: DishItem
    var body: some View {
        FeatureCard(dish: dish, aspectRatio: 1.8, at: .end)
            .cornerRadius(14)
    }
}
