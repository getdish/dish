import SwiftUI

struct ControlsLocationSearchBarView: View {
  @Environment(\.colorScheme) var colorScheme
  @EnvironmentObject var screen: ScreenModel
  @EnvironmentObject var store: AppStore
  @State var textField: UITextField? = nil
  @State private var isFocused: Bool = false

  var locationSearch: Binding<String> {
    store.binding(for: \.map.locationLabel, { .map(.setLocationLabel($0)) })
  }

  var cancelButton: some View {
    Button(action: {
      UIApplication.shared.endEditing(true)  // this must be placed before the other commands here
      self.isFocused = false
    }) {
      Text("Done")
        .foregroundColor(.white)
        .fontWeight(.bold)
    }
  }

  private class TextFieldObserver: NSObject {
    @objc
    func textFieldDidBeginEditing(_ textField: UITextField) {
      textField.selectAll(nil)
    }
  }

  private let textFieldObserver = TextFieldObserver()

  var body: some View {
    HStack {
      HStack {
        TextField(
          "",
          text: self.locationSearch,
          onEditingChanged: { isEditing in
            async {
              self.isFocused = isEditing
            }

            if isEditing {
              self.store.send(.home(.setSearchFocus(.location)))
            } else {
              async {
                if self.store.state.home.searchFocus == .location {
                  self.store.send(.home(.setSearchFocus(.off)))
                }
              }
            }

            if isEditing {
              // select all text
              if let textField = self.textField {
                textField.becomeFirstResponder()
                textField.selectAll(nil)
              }
            }
          })
          .introspectTextField { next in
            self.textField = next

            next.addTarget(
              self.textFieldObserver,
              action: #selector(TextFieldObserver.textFieldDidBeginEditing),
              for: .editingDidBegin
            )
          }

        Spacer()

        if isFocused {
          cancelButton
            .transition(.opacity)
        }
      }
        .font(.system(size: 14))
        .multilineTextAlignment(isFocused ? .leading : .center)
        .padding(.leading, 20)
        .padding(.trailing, 10)
        .controlButtonStyle()
        .animation(.spring())
        .overlay(
          HStack {
            Image(systemName: "magnifyingglass")
              .resizable()
              .scaledToFit()
              .frame(width: 12, height: 12)
              .foregroundColor(.white)
              .opacity(0.25)
              .onTapGesture {
                App.enterRepl = true
            }
            
            Spacer()
          }
            .padding(.leading, 12)
        )
    }
  }
}
