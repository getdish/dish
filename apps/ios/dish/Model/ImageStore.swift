import CoreLocation
import Foundation
import SwiftUI

final class ImageStore {
  typealias ImageDictionary = [String: CGImage]
  fileprivate var images: ImageDictionary = [:]

  fileprivate static var scale = 2

  static var shared = ImageStore()

  func image(name: String) -> Image {
    let index = guaranteeImage(name: name)

    return Image(
      images.values[index], scale: CGFloat(ImageStore.scale), label: Text(verbatim: name))
  }

  static func loadImage(name: String) -> CGImage {
    guard
      let url = Bundle.main.url(forResource: name, withExtension: "jpg"),
      let imageSource = CGImageSourceCreateWithURL(url as NSURL, nil),
      let image = CGImageSourceCreateImageAtIndex(imageSource, 0, nil)
    else {
      fatalError("Couldn't load image \(name).jpg from main bundle.")
    }
    return image
  }

  fileprivate func guaranteeImage(name: String) -> ImageDictionary.Index {
    if let index = images.index(forKey: name) { return index }

    images[name] = ImageStore.loadImage(name: name)
    return images.index(forKey: name)!
  }
}
