import SwiftUI
import MapKit
import Combine

let cameraBottom = Screen.height * 0.55

struct UniqueView<Content: View>: View, Identifiable {
  var id: Int
  var content: Content
  var body: AnyView {
    AnyView(content)
  }
}

struct Home: View {
  @SwiftUI.Environment(\.colorScheme) var colorScheme: ColorScheme
  @ObservedObject var homeStore = Store.home
  
  var isDragging = false
  
  var body: some View {
    print("render home")
    print("home home \(self.homeStore.currentPage == .home)")
    return GeometryReader { geometry in
      MagicMove(animate: self.homeStore.dish != nil) {
        ZStack {
          DishCamera()
          
          Pager(
            pagerStore: self.homeStore.pager,
            disableDragging: self.homeStore.currentPage == .home,
            pages: [
              UniqueView(
                id: 0,
                content: AnyView(
                  ScreenRoundedPage(content: DishMap())
                )
              ),
              UniqueView(
                id: 1,
                content: AnyView(
                  ScreenRoundedPage(
                    content: Rectangle()
                      .foregroundColor(Color.black.opacity(0.0001))
                      .frame(maxWidth: .infinity, maxHeight: .infinity)
                  )
                )
              )
            ]
          )
          
          DishBottomNav()
          
          DishDragSide()
            .disabled(self.homeStore.currentPage == .camera) // || self.homeStore.showDrawer
          
          DishDishGallery()
          
          DishTopBar()
          
          DishSideBar()
            .frame(maxHeight: Screen.height - Screen.statusBarHeight - 30)
        }
        .background(
          self.colorScheme == .light ? Color.white : Color.black.opacity(0.8)
        )
          .edgesIgnoringSafeArea(.all)
      }
    }
  }
}

struct ScreenRoundedPage<Content: View>: View {
  var content: Content
  var body: some View {
    VStack {
      content
    }
    .cornerRadius(40)
    .shadow(color: Color.black.opacity(0.25), radius: 20, y: 10)
  }
}

struct DishDragSide: View {
  var body: some View {
    HStack {
      Spacer()
      Rectangle()
        .foregroundColor(Color.black.opacity(0.0001))
        // idk why but Screen.height - Screen.statusBarHeight is bigger than full height
        .frame(width: 40, height: Screen.height - Screen.statusBarHeight - 40)
        .gesture(
          DragGesture(minimumDistance: 10)
            .onChanged({ value in
              print("drag DishDragSide")
              let next = Double((0 - value.translation.width) / Screen.width)
              Store.home.pager.index = min(2, max(0, next))
            })
            .onEnded({ value in
              Store.home.pager.onDragEnd(value)
            })
      )
    }
  }
}

#if DEBUG
struct Home_Previews: PreviewProvider {
  static var previews: some View {
    Home()
      .previewDevice("iPhone X")
  }
}
#endif
