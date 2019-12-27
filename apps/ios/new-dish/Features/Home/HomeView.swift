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

let homePager = PagerStore()

struct HomeViewContent: View {
    var width: CGFloat = 0
    var height: CGFloat = 0
    @EnvironmentObject var store: AppStore
    @State private var index = 0
    @State private var disableDragging = true

    var body: some View {
        ZStack {
            PagerView(
                pageCount: 2,
                pagerStore: homePager,
                disableDragging: self.disableDragging
                ) {
                    HomeMainView()
                    Image(systemName: "photo").resizable()
            }
            .onChangePage { index in
                self.disableDragging = index == 0
                self.store.send(.home(.changeHomePage(index == 0 ? .home : .camera)))
            }
            // just drag from edge (to camera)
            .simultaneousGesture(
                DragGesture()
                    .onChanged { value in
                        // right edge
                        if self.width - value.startLocation.x < 10 {
                            let next = Double((0 - value.translation.width) / self.width)
                            homePager.index = min(1, max(0, next))
                        }
                }
                .onEnded { value in
                    if homePager.index.rounded() != homePager.index {
                       homePager.onDragEnd(value)
                    }
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
           .embedInAppEnvironment(Mocks.galleryVisibleDish)
    }
}

//                SideDrawerView(
//                    isOpen: self.$sideDrawerShown,
//                    content: {
//                        HomeViewContent(height: geometry.size.height)
//                    },
//                    drawer: {
//                        // TODO @majid it shows DishSidebarView() if i uncomment DishSidebarView
//                        EmptyView().frame(height: 100)
//    //                   DishSidebarView()
//                    }
//                )
