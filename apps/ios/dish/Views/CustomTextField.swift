import SwiftUI

struct CustomTextField: UIViewRepresentable {
  var placeholder = ""
  @Binding var text: String
  var isFirstResponder: Bool = false
  var onEditingChanged: ((Bool) -> Void)?

  func makeUIView(context: UIViewRepresentableContext<CustomTextField>) -> UITextField {
    let textField = UITextField(frame: .zero)
    textField.delegate = context.coordinator
    return textField
  }

  func makeCoordinator() -> CustomTextField.Coordinator {
    return Coordinator(self)
  }

  func updateUIView(_ uiView: UITextField, context: UIViewRepresentableContext<CustomTextField>) {
    if uiView.text != text {
      uiView.text = text
    }
    if uiView.placeholder != placeholder {
      uiView.placeholder = placeholder
    }
    if isFirstResponder && !context.coordinator.didBecomeFirstResponder && !uiView.isFirstResponder
    {
      uiView.becomeFirstResponder()
      context.coordinator.didBecomeFirstResponder = true
    }
  }

  class Coordinator: NSObject, UITextFieldDelegate {
    var ref: CustomTextField
    var didBecomeFirstResponder = false

    init(_ customTextField: CustomTextField) {
      self.ref = customTextField
    }

    func textFieldDidChangeSelection(_ textField: UITextField) {
      ref.text = textField.text ?? ""
    }

    func textFieldDidBeginEditing(_ textField: UITextField) {
      if let cb = ref.onEditingChanged {
        cb(true)
      }
    }

    func textFieldDidEndEditing(_ textField: UITextField) {
      if let cb = ref.onEditingChanged {
        cb(false)
      }
    }
  }
}
