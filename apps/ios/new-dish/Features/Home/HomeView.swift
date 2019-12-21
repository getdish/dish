import SwiftUI

struct HomeView: View {
    @Environment(\.colorScheme) var colorScheme: ColorScheme
    @State private var sideDrawerShown = false
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                HomeViewContent(height: geometry.size.height)
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

fileprivate let pager = PagerStore()

struct HomeViewContent: View {
    var height: CGFloat = 0
    @EnvironmentObject var store: AppStore
    @State private var index = 0

    var body: some View {
        ZStack {
            PagerView(
                pageCount: 2,
                pagerStore: pager,
                disableDragging: false
                ) {
                    HomeMainView()
                    Image(systemName: "photo").resizable()
            }
            .onChangePage { index in
                self.store.send(.changeHomePage(index == 0 ? .home : .camera))
            }
            
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
