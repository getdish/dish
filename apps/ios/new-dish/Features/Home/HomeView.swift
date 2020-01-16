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
    @State var disableDragging = true
    @State var isDragging = false
    @State var shadowStr: Double = 1

    var body: some View {
        // animate home shadow only
        let next: Double = self.store.state.home.view == .home || isDragging ? 1 : 0
        if next != self.shadowStr {
            DispatchQueue.main.async {
                withAnimation(.spring()) {
                    self.shadowStr = next
                }
            }
        }
        
        return ZStack {
            PagerView(
                pageCount: homePageCount,
                pagerStore: homePager,
                disableDragging: self.disableDragging || App.store.state.home.showCamera
                ) { isDragging in
                    // account page
                    DishAccount()
                        .clipped()
                        .cornerRadius(80)
                        .zIndex(0)
                    
                    // home page
                    HomeMainView()
                        .clipped()
                        .cornerRadius(80)
                        .shadow(
                            color: Color.black.opacity(self.shadowStr),
                            radius: 60,
                            x: 0,
                            y: 0
                        )
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
            
            TopNavView()
            
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
