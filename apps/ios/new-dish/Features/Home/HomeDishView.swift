import SwiftUI

struct HomeDishView: View {
    @Environment(\.colorScheme) var colorScheme
    @Environment(\.geometry) var appGeometry
    
    var body: some View {
        // pushed map below the border radius of the bottomdrawer
        let appHeight = appGeometry?.size.height ?? 100
        let dishMapHeight = appHeight - Constants.homeInitialDrawerHeight + 40 + 30

        return GeometryReader { geometry in
            ZStack {
                Color.black.frame(maxWidth: .infinity, maxHeight: .infinity)
                
                MapView(
                    width: geometry.size.width,
                    height: dishMapHeight,
                    darkMode: self.colorScheme == .dark
                )
                
                HomeMapControls()
                
                HomeMainDrawer()
                
                DishGalleryView()
                
                DragPagerSidebar()
            }
            .clipped()
            .shadow(color: Color.black.opacity(0.25), radius: 20, x: 0, y: 0)
        }
    }
}

// todo @majid I'd like this sidebar area to be draggable, or something similar in functionality
// the goal is that when you are on the home, you can drag just from the right edge to move
// the pager to the second index

struct DragPagerSidebar: View {
    var body: some View {
        HStack {
            Spacer()
            Color.black
                .opacity(0.0001)
                // idk why but Screen.height - Screen.statusBarHeight is bigger than full height
                .frame(width: 40, height: Screen.height - Screen.statusBarHeight - 40)
                .gesture(
                    DragGesture(minimumDistance: 5)
                        .onChanged({ value in
                            //                            print("drag DishDragSide")
                            //                            let next = Double((0 - value.translation.width) / Screen.width)
                            //                            Store.home.pager.index = min(2, max(0, next))
                        })
                        .onEnded({ value in
                            //                            Store.home.pager.onDragEnd(value)
                        })
            )
        }
    }
}
