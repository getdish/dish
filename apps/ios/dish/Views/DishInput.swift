import SwiftUI

struct DishInputStyle: ViewModifier {
  func body(content: Content) -> some View {
    content
      .padding()
      .background(Color.black.opacity(0.075))
      .cornerRadius(5)
  }
}

struct DishInput: View {
  @Binding var text: String
  var name: String

  var body: some View {
    TextField(name, text: $text)
      .modifier(DishInputStyle())

  }
}

#if DEBUG
  struct DishInput_Previews: PreviewProvider {

    static var previews: some View {
      DishInput(text: .constant(""), name: "Some name")
        .padding()
    }
  }
#endif
