import SwiftUI

struct InputModifier: ViewModifier {
  func body(content: Content) -> some View {
    content
      .padding()
      .background(Color.black.opacity(0.075))
      .cornerRadius(5)
  }
}

struct CustomInput : View {
  @Binding var text: String
  var name: String
  
  var body: some View {
    TextField(name, text: $text)
      .modifier(InputModifier())
    
  }
}

#if DEBUG
struct CustomInput_Previews : PreviewProvider {
  
  static var previews: some View {
    CustomInput(text: .constant(""), name: "Some name")
      .padding()
  }
}
#endif
