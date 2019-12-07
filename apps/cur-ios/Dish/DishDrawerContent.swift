import SwiftUI
import Combine

struct DishDrawerContent: View {
  var focusAction: (() -> Void)?

  var body: some View {
    VStack {
      SearchInput(
        placeholder: "'Pho', 'Burger', 'Salad'..."
      )
        .padding(.horizontal)
        .onTapGesture {
          self.focusAction?()
        }
      FoodList()
    }
  }
}

extension DishDrawerContent {
  func onFocusSearch(perform action: @escaping () -> Void ) -> Self {
    var copy = self
    copy.focusAction = action
    return copy
  }
}

#if DEBUG
struct DishDrawerContent_Previews: PreviewProvider {
  static var previews: some View {
    DishDrawerContent()
  }
}
#endif
