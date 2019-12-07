import SwiftUI

struct DishSideBar: View {
  @ObservedObject var homeStore = Store.home
  
  var body: some View {
    DrawerView(
      isShow: self.$homeStore.showMenuDrawer,
      drawerOrientation: Axis.Set.horizontal,
      drawerWidth: Screen.width * 0.8,
      drawerBackgroundColor: Color.white,
      shouldAutoHideShadow: true,
      content: VStack {
        Spacer()
        SignInView()
        Spacer()
        
        Button(action: {
          print(UserDefaults.standard.dictionaryRepresentation())
        }) {
          Text("DEBUG")
        }
      }
    )
  }
}

#if DEBUG
struct DishSideBar_Previews: PreviewProvider {
  static var previews: some View {
    DishSideBar()
  }
}
#endif
