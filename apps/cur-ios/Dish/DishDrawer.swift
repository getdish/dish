import SwiftUI
import Combine

// TODO how to pass in a modifier as argument to SearchInput?
struct MainSearchFieldModifier: ViewModifier {
  func body(content: Content) -> some View {
    content
      .overlay(
        RoundedRectangle(cornerRadius: 30)
          .stroke(Color(.secondarySystemBackground), lineWidth: 2)
    )
  }
}

struct DishDrawer: View {
  @ObservedObject var homeStore = Store.home
  
  var body: some View {
    let hiddenHeight = CGFloat(cameraBottom)
    return ZStack {
      DrawerView(
        isShow: $homeStore.showDrawer,
        defaultHeight: initialDrawerHeight,
        fullHeight: initialDrawerFullHeight,
        hiddenHeight: hiddenHeight,
        drawerBackgroundColor: Color(.systemBackground),
        content: DishDrawerContent()
      )
        .onChangeHeight { height in
          Store.home.currentDrawerHeight = height
      }
      .onChangeOpen { open in
        if !open {
          UIApplication.shared.endEditing(true)
        }
      }
    }
  }
}

struct TagsBar: View {
  var body: some View {
    ScrollView(.horizontal, showsIndicators: false) {
      HStack {
        Tag {Image("uber").resizable().frame(width: 42, height: 42)}
        Tag {Image("postmates").resizable().frame(width: 42, height: 42)}
        Tag {Image("doordash").resizable().frame(width: 42, height: 42)}
        Tag {Image("grubhub").resizable().frame(width: 42, height: 42)}
      }
      .padding(.vertical, 8)
      .padding(.horizontal)
    }
  }
}

struct Tag<Content>: View where Content: View {
  let content: () -> Content
  
  init(@ViewBuilder content: @escaping () -> Content) {
    self.content = content
  }
  
  var body: some View {
    HStack {
      content()
    }
    .padding(.vertical, 0)
    .padding(.horizontal, 9)
    .background(Color(.tertiarySystemBackground).opacity(0.9))
    .cornerRadius(5)
    .shadow(color: Color.black.opacity(0.18), radius: 2, y: 2)
  }
}

struct DishDrawerContent: View {
  @State var searchText = ""
  @State var scrollAtTop = true
  let items = features.chunked(into: 2)
  
  init() {
    UINavigationBar.appearance().backgroundColor = .clear
  }
  
  var body: some View {
    print("render drawer")
    return VStack(spacing: 3) {
      VStack(spacing: 3) {
        SearchInput(
          placeholder: "Pho, Burger, Salad...",
          inputBackgroundColor: Color(.secondarySystemGroupedBackground),
          scale: self.scrollAtTop ? 1.25 : 1.0,
          sizeRadius: 2.0,
          searchText: self.$searchText
        )
          .padding(.horizontal)
          .onTapGesture {
            Store.home.showDrawer = true
        }
        
        TagsBar()
      }
      
      ScrollView {
        VStack(spacing: 6) {
          ForEach(0 ..< self.items.count) { index in
            HStack(spacing: 6) {
              ForEach(self.items[index]) { item in
                DishCard(landmark: item)
              }
            }
          }
          
          // bottom padding
          Spacer().frame(height: 40)
        }
        .onScroll { print("\($0)") }
      }
      .padding(.horizontal, 6)
    }
  }
}

struct DishCard: View {
  var landmark: Landmark
  
  var body: some View {
    FeatureCard(landmark: landmark, at: .start)
      .cornerRadius(14)
      .onTapGesture {
        Store.home.dish = self.landmark
      }
  }
}

#if DEBUG
struct DebugView: View {
  @State var showDrawer = true
  var body: some View {
    DishDrawer()
  }
}
struct DishDrawerContent_Previews: PreviewProvider {
  static var previews: some View {
    DebugView()
  }
}
#endif


///

/// Fixed swipe gesture NavigationLink
struct NavigationLink<Destination: View, Label: View>: View {
  var destination: Destination
  var label: () -> Label
  
  init(destination: Destination, @ViewBuilder label: @escaping () -> Label) {
    self.destination = destination
    self.label = label
  }
  
  /// If this crashes, make sure you wrapped the NavigationLink in a NavigationView
  @EnvironmentObject private var nvc: NavigationViewUINavigationController
  
  var body: some View {
    Button(action: {
      let rootView = self.destination.environmentObject(self.nvc)
      let hosted = UIHostingController(rootView: rootView)
      self.nvc.pushViewController(hosted, animated: true)
    }, label: label)
  }
}

/// Fixed swipe gesture NavigationView
struct NavigationView<Content: View>: UIViewControllerRepresentable {
  
  var content: () -> Content
  
  init(@ViewBuilder content: @escaping () -> Content) {
    self.content = content
  }
  
  func makeUIViewController(context: Context) -> UINavigationController {
    let nvc = NavigationViewUINavigationController()
    nvc.navigationBar.setBackgroundImage(UIImage(), for: .default)
    nvc.navigationBar.shadowImage = UIImage()
    nvc.navigationBar.isTranslucent = true
    nvc.view.backgroundColor = .clear
    nvc.view.backgroundColor = .clear
    //    nvc.view.subviews.forEach { $0.backgroundColor = .clear }
    let host = UIHostingController(rootView: content().environmentObject(nvc))
    host.view.backgroundColor = .clear
    nvc.viewControllers = [host]
    return nvc
  }
  
  func updateUIViewController(_ uiViewController: UINavigationController, context: Context) {}
}

/// Fileprivate type to not expose the navigation controller to all views
fileprivate class NavigationViewUINavigationController: UINavigationController, UINavigationControllerDelegate, ObservableObject {
  
  
  // these two functions let us remove titlebar on first view
  override func viewDidLoad() {
    super.viewDidLoad()
    // Do any additional setup after loading the view.
    self.delegate = self
  }
  
  func navigationController(_ navigationController: UINavigationController, willShow viewController: UIViewController, animated: Bool) {
    if viewController == self.viewControllers.first {
      self.setNavigationBarHidden(true, animated: animated)
    } else {
      self.setNavigationBarHidden(false, animated: animated)
    }
  }
}
