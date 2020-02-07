import SwiftUI

struct HomeView: View {
    @Environment(\.colorScheme) var colorScheme: ColorScheme
    @State private var sideDrawerShown = false
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                HomeViewInner(
                    width: geometry.size.width,
                    height: geometry.size.height
                )
            }
            .background(
                self.colorScheme == .light ? Color.white : Color.black.opacity(0.8)
            )
        }
        .embedInGeometryReader()
    }
}

fileprivate let homePageCount = 3
let homePager = PagerStore(
    index: 1
)

fileprivate let homeViewsIndex: [HomePageView] = [.me, .home, .camera]

struct HomeViewInner: View {
    var width: CGFloat = 0
    var height: CGFloat = 0
    @EnvironmentObject var store: AppStore
    @State var disableDragging = true
    @State var isDragging = false

    var body: some View {
        ZStack {
            PrintGeometryView("HomeView")
            
            PagerView(
                pageCount: homePageCount,
                pagerStore: homePager,
                disableDragging: self.disableDragging || App.store.state.home.showCamera
                ) { isDragging in
                    //
                    // ⚠️ ⚠️ ⚠️
                    //    ADDING .clipped() to any of these causes perf issues!!!
                    //    animations below seem to be choppier
                    // ⚠️ ⚠️ ⚠️
                    //

                    // account page
                    DishAccount()
                        .zIndex(0)

                    // home page
                    HomeMainView()
                        .zIndex(2)

                    // third page
                    Color.black
            }
            .onChangeDrag { isDragging in
                print("set isDragging \(isDragging)")
                self.isDragging = isDragging
            }
            .onChangePage { index in
                print("change page to index \(index)")
                let view = homeViewsIndex[index]
                self.disableDragging = view == .home
                self.store.send(.home(.setView(view)))
            }
            // just drag from edge (to camera/account)
            .simultaneousGesture(
                DragGesture()
                    .onChanged { value in
                        if homeViewState.dragState == .searchbar { return }
                        let isOnRightEdge = self.width - value.startLocation.x < 10
                        let isOnLeftEdge = value.startLocation.x < 10
                        if isOnRightEdge || isOnLeftEdge {
                            if abs(value.translation.width) > 10 {
                                homeViewState.setDragState(.pager)
                            }
                            homePager.drag(value)
                        }
                }
                .onEnded { value in
                    if homeViewState.dragState == .pager {
                        homePager.onDragEnd(value)
                        homeViewState.setDragState(.idle)
                    }
                }
            )
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
