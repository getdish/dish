import SwiftUI
import SwiftPhotoGallery

struct ImageGallery: UIViewControllerRepresentable {
  var isPresented: Binding<Bool>

  func makeCoordinator() -> ImageGallery.Coordinator {
    Coordinator(ImageGalleryController(), isPresented: self.isPresented)
  }
  
  func makeUIViewController(context: UIViewControllerRepresentableContext<ImageGallery>) -> UIViewController {
    return context.coordinator.controller
  }
  
  func updateUIViewController(_ uiViewController: UIViewController, context: UIViewControllerRepresentableContext<ImageGallery>) {
    if self.isPresented.wrappedValue == true {
      context.coordinator.controller.show()
    }
  }
  
  class Coordinator: NSObject {
    var isPresented: Binding<Bool>
    var controller: ImageGalleryController
    
    init(_ controller: ImageGalleryController, isPresented: Binding<Bool>) {
      self.controller = controller
      self.isPresented = isPresented
      super.init()
      self.controller.onChangeShow { val in
        self.isPresented.wrappedValue = val
        self.isPresented.update()
      }
    }
  }
}

typealias ChangeShowListener = (Bool) -> Void

class ImageGalleryController: UIViewController, SwiftPhotoGalleryDataSource, SwiftPhotoGalleryDelegate {
  let imageNames = ["charleyrivers.jpg", "icybay.jpg"]
  var changeListener: ChangeShowListener?
  
  override func viewDidLoad() {
    super.viewDidLoad()
  }
  
  func onChangeShow(cb: @escaping ChangeShowListener) {
    self.changeListener = cb
  }
  
  func updateChangeShow(_ val: Bool) {
    if let cb = self.changeListener {
      cb(val)
    }
  }
  
  func show() {
    let gallery = SwiftPhotoGallery(delegate: self, dataSource: self)
    gallery.backgroundColor = UIColor.black
    gallery.pageIndicatorTintColor = UIColor.gray.withAlphaComponent(0.5)
    gallery.currentPageIndicatorTintColor = UIColor.white
    gallery.hidePageControl = false
    present(gallery, animated: true, completion: nil)
    self.updateChangeShow(true)
    /*
     /// Or load on a specific page like this:
     present(gallery, animated: true, completion: { () -> Void in
     gallery.currentPage = self.index
     })
     */
  }
  
  func hide() {
    dismiss(animated: true, completion: nil)
    self.updateChangeShow(false)
  }
  
  // MARK: SwiftPhotoGalleryDataSource Methods
  
  func numberOfImagesInGallery(gallery: SwiftPhotoGallery) -> Int {
    return imageNames.count
  }
  
  func imageInGallery(gallery: SwiftPhotoGallery, forIndex: Int) -> UIImage? {
    return UIImage(named: imageNames[forIndex])
  }
  
  // MARK: SwiftPhotoGalleryDelegate Methods

  func galleryDidTapToClose(gallery: SwiftPhotoGallery) {
    self.hide()
  }
}
