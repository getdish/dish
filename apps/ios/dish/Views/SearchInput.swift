import Introspect
import SwiftUI

struct EmptyModifier: ViewModifier {
  func body(content: Content) -> some View {
    content
  }
}

struct SearchInputTag: Identifiable, Equatable {
  var color: Color
  var text: String
  var deletable: Bool = true

  var id: String {
    "\(color.hashValue)\(text)"
  }
}

struct SearchInputTagView: View {
  var tag: SearchInputTag
  var fontSize: CGFloat

  var body: some View {
    HStack(spacing: 8) {
      Text(tag.text)
      //                .fixedSize()
        .font(.system(size: fontSize))
        .frame(minWidth: CGFloat(min(14, tag.text.count) * 9) + 6, maxWidth: 140)

      if tag.deletable {
        VStack {
          Image(systemName: "xmark")
            .resizable()
            .frame(width: 12, height: 12)
            .padding(5)
        }
          .background(tag.color.brightness(-0.1))
          .cornerRadius(6)
          .opacity(0.5)
      }
    }
      .foregroundColor(Color.white)
      .padding(.horizontal, self.fontSize * 0.5)
      .padding(.vertical, self.fontSize * 0.35)
      .background(tag.color)
      .cornerRadius(6)
  }
}

struct SearchInput: View {
  var placeholder = "Search"
  var inputBackgroundColor = Color(.secondarySystemBackground)
  var borderColor = Color.clear
  var borderWidth = 1.0
  var blur = 0
  var scale: CGFloat = 1
  var sizeRadius = CGFloat(1)
  var icon: Image?
  var iconSize: CGFloat = 20
  var showCancelInside = false
  var onTapLeadingIcon: (() -> Void)?
  var onEditingChanged: ((Bool) -> Void)?
  var onCancel: (() -> Void)?
  var onClear: (() -> Void)?
  var after: AnyView?
  var onTextField: ((UITextField) -> Void)?
  var isFirstResponder: Bool = false
  @Binding var searchText: String
  var showInput = true

  @State private var showCancelButton: Bool = false
  @State var inputSize: CGSize = .zero

  @Environment(\.colorScheme) var colorScheme

  func handleEditingChanged(isEditing: Bool) {
    async {
      self.showCancelButton = isEditing
      if let cb = self.onEditingChanged {
        cb(isEditing)
      }
    }
  }

  var cancelButton: some View {
    Button("Done") {
      UIApplication.shared.endEditing(true)  // this must be placed before the other commands here
      self.showCancelButton = false
      if let cb = self.onCancel {
        cb()
      }
    }
      .foregroundColor(Color(.systemBlue))
  }

  var body: some View {
    let pad = 11 * scale
    let fontSize = 16 * (scale - 1) / 2 + 17
    let horizontalSpacing = 13 * scale

    return ZStack {
      HStack(spacing: 0) {
        Spacer().frame(width: 48)
        
        Group {
          if showInput {
            TextField(
              self.placeholder,
              text: self.$searchText,
              onEditingChanged: self.handleEditingChanged
              //                            isFirstResponder: self.isFirstResponder,
              //                            onEditingChanged: self.handleEditingChanged
            )
              .font(.system(size: fontSize, weight: .semibold, design: .rounded))
          } else {
            // temp bugfix for above TODO problem...
            HStack {
              Group {
                if self.searchText != "" {
                  Text(self.searchText)
                } else {
                  Text(self.placeholder).opacity(0.3)
                }
              }
              .font(.system(size: fontSize))
              Spacer()
            }
          }
        }
        .frame(width: self.inputSize.width)
        
        Spacer()
      }
      .frame(height: pad * 2 + fontSize * 1.2)
      
      // Search view
      HStack {
        HStack(spacing: 0) {
          Button(action: {
            if let cb = self.onTapLeadingIcon {
              cb()
            } else {
              //                            self.isFirstResponder = true
            }
          }) {
            VStack {
              VStack {
                (icon ?? Image(systemName: "magnifyingglass"))
                  .resizable()
                  .scaledToFit()
                  .foregroundColor(self.colorScheme == .dark ? .white : .black)
              }
                .frame(width: self.iconSize * scale, height: self.iconSize * scale)
            }
          }
          
          Group {
            Spacer().frame(width: horizontalSpacing)
            Spacer()
              .onGeometrySizeChange {
                self.inputSize = $0
            }
            Spacer().frame(width: horizontalSpacing)
          }
          .allowsHitTesting(false)
          .disabled(true)
          

          if self.searchText != "" {
            Group {
              Spacer().frame(width: horizontalSpacing)
              Button(action: {
                self.searchText = ""
                if let cb = self.onClear {
                  cb()
                }
              }) {
                Image(systemName: "xmark.circle.fill")
                  .resizable()
                  .scaledToFit()
                  .frame(width: 16 + 2 * scale, height: 16 + 2 * scale)
              }
                .transition(.opacity)
            }
          }

          if showCancelButton && showCancelInside {
            Group {
              Spacer().frame(width: horizontalSpacing)
              cancelButton
            }
          }

          if after != nil {
            Group {
              Spacer().frame(width: horizontalSpacing)
              after.frame(height: 24 * scale)
            }
          }
        }
          .padding(.horizontal, pad)
          .foregroundColor(.secondary)
          .cornerRadius(10.0 * scale * sizeRadius)
          .overlay(
            RoundedRectangle(cornerRadius: 10.0 * scale * sizeRadius)
              .stroke(self.borderColor, lineWidth: 1)
          )

        if showCancelButton && !showCancelInside {
          cancelButton
        }
      }
    }
    .background(self.inputBackgroundColor)
  }
}

extension UIApplication {
  func endEditing(_ force: Bool) {
    self.windows
      .filter { $0.isKeyWindow }
      .first?
      .endEditing(force)
  }
}

#if DEBUG
  struct SearchInputPreview: View {
    @State var searchText = ""

    var body: some View {
      VStack {
        SearchInput(searchText: $searchText)
        SearchInput(scale: 1.25, searchText: $searchText)
      }
    }
  }
  struct SearchInput_Previews: PreviewProvider {
    static var previews: some View {
      SearchInputPreview()
    }
  }
#endif
