import SwiftUI

struct HomeView: View {
    @Environment(\.colorScheme) var colorScheme: ColorScheme
    @State private var sideDrawerShown = false
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                HomeViewContent(
                    width: geometry.size.width,
                    height: geometry.size.height
                )
                TopNav()
            }
            .background(
                self.colorScheme == .light ? Color.white : Color.black.opacity(0.8)
            )
        }
        .embedInGeometryReader()
        .edgesIgnoringSafeArea(.all)
    }
}

fileprivate let homePageCount = 3
let homePager = PagerStore(
    index: 1
)

fileprivate let homeViewsIndex: [HomePageView] = [.me, .home, .camera]

struct HomeViewContent: View {
    var width: CGFloat = 0
    var height: CGFloat = 0
    @EnvironmentObject var store: AppStore
    @State private var disableDragging = true

    var body: some View {
        let dragState = HomeDragLock.state
        
        return ZStack {
            PagerView(
                pageCount: homePageCount,
                pagerStore: homePager,
                disableDragging: self.disableDragging
                ) {
                    DishAccount()
                        .clipped()
                        .cornerRadius(80)
                    HomeMainView()
                        .clipped()
                        .cornerRadius(80)
                    DishCamera()
                        .clipped()
                        .cornerRadius(80)
            }
            .onChangePage { index in
                let view = homeViewsIndex[index]
                self.disableDragging = view == .home
                self.store.send(.home(.setView(view)))
            }
            // just drag from edge (to camera)
            .simultaneousGesture(
                DragGesture()
                    .onChanged { value in
                        if dragState == .searchbar {
                            return
                        }
                        let isOnRightEdge = self.width - value.startLocation.x < 10
                        let isOnLeftEdge = value.startLocation.x < 10
                        if isOnRightEdge || isOnLeftEdge {
                            if abs(value.translation.width) > 10 {
                                HomeDragLock.setLock(.pager)
                            }
                            let dragIndexDiff = Double(-value.translation.width / self.width)
                            homePager.drag(dragIndexDiff)
                        }
                }
                .onEnded { value in
                    if homePager.index.rounded() != homePager.index {
                       homePager.onDragEnd(value)
                    }
                    HomeDragLock.setLock(.idle)
                }
            )
            
            BottomNav()
        }
        .frame(maxHeight: self.height)
    }
}

struct HomeView_Previews: PreviewProvider {
    static var previews: some View {
        HomeView()
           .embedInAppEnvironment()
    }
}
