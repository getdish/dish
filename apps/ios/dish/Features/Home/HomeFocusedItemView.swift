import SwiftUI

struct HomeFocusedItemView: View {
  @EnvironmentObject var screen: ScreenModel
  var focusedItem: HomeFocusedItem? = nil
  var showBookmark = true
  var showDescription = true
  
  var height: CGFloat {
    var x: CGFloat = 60
    if showDescription {
      x += 40
    }
    return x
  }
  
  @State var lastItem: HomeFocusedItem? = nil
  
  var body: some View {
    let isFocused = self.focusedItem != nil
    let focusedY = self.focusedItem?.targetMinY ?? 0
    let lastY = self.lastItem?.targetMinY ?? 0
    let minY: CGFloat = isFocused ? focusedY : lastY - 20
    let y: CGFloat = minY - self.height - 2
    
    return SwipeDownToDismissView(
      onClose: {
        App.store.send(.home(.setFocusedItem(nil)))
    }
    ) {
      VStack {
        HStack {
          VStack(alignment: .center, spacing: 12) {
            Text("Miss Saigon")
              .font(.system(size: 18))
              .fontWeight(.bold)
            if self.showDescription {
              Text("Traditional northern style pho known for the broth.")
                .font(.system(size: 15))
            }
            Text("Closes 8pm · Vietnamese 🇻🇳")
              .font(.system(size: 14))
          }
          .environment(\.colorScheme, .dark)
          .padding(.horizontal, 19)
          .padding(.vertical, 14)
          .background(Color.black.opacity(0.8))
          .cornerRadiusSquircle(23)
          .frame(width: self.screen.width * 0.7, height: self.height)
          .overlay(
            VStack {
              HStack {
                Text("\(self.focusedItem?.rank ?? 0).")
                  .font(.system(size: 18))
                  .fontWeight(.black)
                  .frame(width: 36, height: 36)
                  .background(Color.white)
                  .cornerRadius(32)
                  .rotationEffect(.degrees(-20))
                  .offset(x: 5, y: -15)
                Spacer()
                if self.showBookmark {
                  Image(systemName: "plus")
                    .frame(width: 42)
                    .modifier(
                      ControlsButtonStyle(
                        background: Color.purple,
                        cornerRadius: 100,
                        height: 42,
                        hPad: 0
                      )
                  )
                    .offset(x: 12, y: -18)
                    .scaleEffect(1.1)
                }
              }
              Spacer()
            }
          )
            .shadow(color: Color.black.opacity(0.4), radius: 16, y: 5)
            .shadow(color: Color.black.opacity(0.3), radius: 13, x: -10, y: 5)
          
          Spacer()
        }
        .padding(.leading, 8)
        Spacer()
      }
    }
    .id(self.focusedItem?.dish.id ?? 0)
    .opacity(self.focusedItem == nil ? 0 : 1)
    .offset(y: y)
    .animation(.spring())
  }
}


