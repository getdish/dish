import SwiftUI
import Combine

fileprivate let hPad = CGFloat(20)
fileprivate let largeButtonWidth = CGFloat(70)
fileprivate let betweenWidth = (Screen.width - hPad * 2) * 0.5

// moves the large button over to center
fileprivate let transitionXCamera = betweenWidth - (largeButtonWidth / 2)
fileprivate let transitionXHome = -80

struct DishBottomNav: View {
  @ObservedObject var homePageStore = Store.home.pager
  @ObservedObject var cameraStore = Store.camera
  
  var body: some View {
    return VStack {
      Spacer()
      ZStack {
        ZStack {
          HStack {
            DishButton()
              .animation(.spring())
              .offset(x: CGFloat(1.0 - self.homePageStore.index) * CGFloat(transitionXHome))
            Spacer()
          }
          
          HStack {
            Spacer()
            CameraButton()
              .animation(.spring())
              .offset(x: CGFloat(self.homePageStore.index) * -CGFloat(transitionXCamera))
          }
        }
        .animation(Animation.spring(response: 0.25))
        .offset(y: self.cameraStore.isCaptured ? 100 : 0)
        
        HStack {
          Image(systemName: "xmark")
            .onTapGesture {
              Store.camera.resume()
            }
          
          Spacer().frame(width: 40)
          
          ScrollView(.horizontal) {
            HStack {
              Group {
                Text("Brilliance").fontWeight(.semibold)
                Text("Contrast").fontWeight(.semibold)
                Text("Brightness").fontWeight(.semibold)
                Text("Highlights").fontWeight(.semibold)
                Text("Shadows").fontWeight(.semibold)
                Text("Midtones").fontWeight(.semibold)
              }
              .padding()
            }
          }
          
        }
        .animation(Animation.spring(response: 0.25))
        .offset(y: self.cameraStore.isCaptured ? 0 : 100)
      }
    }
    .padding(.horizontal, hPad)
    .padding(.bottom, 30)
  }
}

struct DishButton: View {
  @ObservedObject var homeStore = Store.home

  var body: some View {
    Button(action: {
      if self.homeStore.currentPage == .home {
        // take photo!
      } else {
        withAnimation(.spring(response: 0.3)) {
          self.homeStore.pager.animateTo(0.0)
        }
      }
    }) {
      HStack {
        Image(systemName: "square.grid.2x2.fill")
          .imageScale(.large)
          .foregroundColor(.white)
      }
      .frameFlex()
    }
    .background(
      BlurView(style: .systemUltraThinMaterial)
    )
    .background(
      LinearGradient(
        gradient: Gradient(colors: [Color("brandBackground").opacity(0.1),
                                    Color("brandBackgroundDarker").opacity(0.2)]),
        startPoint: .top,
        endPoint: .bottom
      )
    )
    .frame(width: 40, height: 40, alignment: .trailing)
    .cornerRadius(80)
    .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 8)
    .overlay(
      RoundedRectangle(cornerRadius: 80)
        .stroke(Color.white.opacity(0.5), lineWidth: 1)
    )
  }
}

struct CameraButton: View {
  @ObservedObject var homeStore = Store.home
  
  var body: some View {
    Button(action: Actions.pressShutter) {
      HStack {
        ZStack {
          Image(systemName: "viewfinder")
            .resizable()
            .frame(width: 35.0, height: 35.0)
            .foregroundColor(.white)
        }
      }
      .frameFlex()
      .gesture(
        DragGesture()
          .onChanged({ value in
            let next = Double((0 - value.translation.width) / Screen.width)
            Store.home.pager.index = min(2, max(0, next))
          })
          .onEnded({ value in
            Store.home.pager.onDragEnd(value)
          })
      )
    }
    .background(
      BlurView(style: .systemUltraThinMaterial)
    )
    .frame(width: largeButtonWidth, height: largeButtonWidth, alignment: .trailing)
    .cornerRadius(80)
    .shadow(color: Color.black.opacity(0.7), radius: 10, x: 0, y: 8)
    .overlay(
      RoundedRectangle(cornerRadius: 80)
        .stroke(Color.white, lineWidth: 2)
    )
    .scaleEffect(self.homeStore.currentPage == .home ? 0.8 : 1.0)
    .animation(.spring())
  }
}

#if DEBUG
struct CameraButton_Previews: PreviewProvider {
  static var previews: some View {
    CameraButton()
  }
}
#endif
