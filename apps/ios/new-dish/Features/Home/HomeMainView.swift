import SwiftUI

struct HomeViewState {
    var scrollY: CGFloat = 0
    var searchY: CGFloat = 0
    var dragY: CGFloat = 0
    var isSnappedToBottom: Bool {
        searchY + dragY > 100
    }
    var y: CGFloat {
        searchY + dragY
    }
    
    func finishDrag() -> HomeViewState {
        var next = self
        next.searchY = next.dragY + next.searchY
        next.dragY = 0
        return next
    }
}

fileprivate let cardRowHeight: CGFloat = 160

struct HomeMainView: View {
    @Environment(\.colorScheme) var colorScheme
    @Environment(\.geometry) var appGeometry
    
    @State var state = HomeViewState()
    
    var body: some View {
        // pushed map below the border radius of the bottomdrawer
        let appHeight = appGeometry?.size.height ?? 100
        let dishMapHeight = state.isSnappedToBottom
            ? Screen.height - 120
            : appHeight - Constants.homeInitialDrawerHeight + state.y
        
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
                    Spacer().frame(height: dishMapHeight - cardRowHeight + 40)
                    HomeCards(isHorizontal: self.state.isSnappedToBottom)
                    // i want an alpha fade-out effect
//                    .mask(
//                        LinearGradient(gradient: Gradient(colors: [.white, .black]), startPoint: .top, endPoint: .bottom)
//                    )
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
                
                VStack {
                    SearchBar()
                        .simultaneousGesture(
                            DragGesture()
                                .onChanged { value in
                                    var next = self.state
                                    print("\(value.location.y) \(value.translation.height)")
                                    next.dragY = value.location.y
                                    self.state = next
                            }
                            .onEnded { value in
                                self.state = self.state.finishDrag()
                            }
                    )
                    Spacer()
                }
                    .padding(.horizontal, 10)
                    .offset(y: dishMapHeight - 23)
                
//                DishGalleryView()
            }
            .clipped()
            .shadow(color: Color.black.opacity(0.25), radius: 20, x: 0, y: 0)
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
    let items = features.chunked(into: 2)
    
    var content: some View {
        VStack(spacing: 10) {
            ForEach(0 ..< self.items.count) { index in
                HStack(spacing: 10) {
                    ForEach(self.items[index]) { item in
                        DishBrowseCard(landmark: item)
                            .frame(height: 200)
                    }
                }
            }
        }
        .padding(.horizontal)
        .frame(width: Screen.width)
    }

    var body: some View {
        VStack {
            Spacer().frame(height: cardRowHeight)
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

#if DEBUG
struct HomeMainView_Previews: PreviewProvider {
    static var previews: some View {
        HomeMainView()
            .embedInAppEnvironment()
    }
}
#endif


