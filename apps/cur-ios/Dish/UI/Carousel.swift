import SwiftUI

struct Carousel: View {
  var body: some View {
    VStack(spacing: 20) {
      ScrollView(.horizontal) {
        HStack(spacing: 20) {
          Spacer()
          
          VStack {
            Image("hiddenlake.jpg")
            
            Text("#1")
          }
          
          VStack {
            Image("hiddenlake.jpg")
            Text("#2")
          }
          
          VStack {
            Image("hiddenlake.jpg")
            Text("#3")
          }
          
          Spacer()
        }
      }
    }
    .padding(.vertical)
  }
}

