import SwiftUI

struct DishScrollView<Content>: UIViewRepresentable where Content: View {
    var content: Content
    
    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    func makeUIView(context: UIViewRepresentableContext<DishScrollView<Content>>) -> UIScrollView {
        let scrollViewVC = DishScrollViewVC<Content>(nibName: nil, bundle: nil)
        scrollViewVC.add(content: content)
        let control = scrollViewVC.scrollView
        return control
    }
    
    func updateUIView(_ uiView: UIScrollView, context: UIViewRepresentableContext<DishScrollView<Content>>) {
        // Do nothing at the moment.
    }
}


final class DishScrollViewVC<Content>: UIViewController where Content: View {
    var scrollView: UIScrollView = UIScrollView()
    var contentView: UIView!
    var contentVC: UIViewController!
    
    
    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
        super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
        setup()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setup()
    }
    
    func setup() {
        self.view.addSubview(self.scrollView)
        self.scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor).isActive = true
        self.scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor).isActive = true
        self.scrollView.topAnchor.constraint(equalTo: view.topAnchor).isActive = true
        self.scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor).isActive = true
        self.scrollView.translatesAutoresizingMaskIntoConstraints = false
    }
    
    
    func add(content: Content) {
        self.contentVC = UIHostingController(rootView: content)
        self.contentView = self.contentVC.view!
        self.scrollView.addSubview(contentView)
        self.contentView.leadingAnchor.constraint(equalTo: self.scrollView.leadingAnchor).isActive = true
        self.contentView.trailingAnchor.constraint(equalTo: self.scrollView.trailingAnchor).isActive = true
        self.contentView.topAnchor.constraint(equalTo: self.scrollView.topAnchor).isActive = true
        self.contentView.bottomAnchor.constraint(equalTo: self.scrollView.bottomAnchor).isActive = true
        self.contentView.translatesAutoresizingMaskIntoConstraints = true
//        self.contentView.widthAnchor.constraint(greaterThanOrEqualTo: self.scrollView.widthAnchor).isActive = true
//        self.contentView.heightAnchor.constraint(greaterThanOrEqualTo: self.scrollView.heightAnchor).isActive = true
    }
}


extension DishScrollViewVC: UIViewControllerRepresentable {
    func makeUIViewController(context: UIViewControllerRepresentableContext<DishScrollViewVC>) -> DishScrollViewVC {
        let vc = DishScrollViewVC()
        return vc
    }
    
    
    func updateUIViewController(_ uiViewController: DishScrollViewVC, context: UIViewControllerRepresentableContext<DishScrollViewVC>) {
        // Do nothing at the moment.
    }
}

//import SwiftUI
//
//struct DishScrollView<Content>: UIViewRepresentable where Content: View {
//    var content: () -> Content
//
//    init(@ViewBuilder content: @escaping () -> Content) {
//        self.content = content
//    }
//
//
//    func makeCoordinator() -> Coordinator {
//        Coordinator(self)
//    }
//
//    func makeUIView(context: Context) -> UIScrollView {
//        let control = UIScrollView()
//        control.refreshControl = UIRefreshControl()
//        control.refreshControl?.addTarget(context.coordinator, action:
//            #selector(Coordinator.handleRefreshControl), for: .valueChanged
//        )
//
//        // Simply to give some content to see in the app
//        let label = UILabel(frame: CGRect(x: 0, y: 0, width: 200, height: 30))
//        label.text = "Scroll View Content"
//        control.addSubview(self.content())
//
//        return control
//    }
//
//
//    func updateUIView(_ uiView: UIScrollView, context: Context) {
//        // code to update scroll view from view state, if needed
//    }
//
//    class Coordinator: NSObject {
//        var control: DishScrollView
//
//        init(_ control: DishScrollView) {
//            self.control = control
//        }
//
//        @objc func handleRefreshControl(sender: UIRefreshControl) {
//            // handle the refresh event
//
//            sender.endRefreshing()
//        }
//    }
//}
