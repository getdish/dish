import SwiftUI

struct DishGalleryView: View {
    @EnvironmentObject var store: AppStore
    @State private var translationY = CGFloat(0.0)
    var shown = false

    var body: some View {
        let hidden = shown == true ? false : self.store.state.galleryDish == nil
        
        return ZStack {
            DishGalleryPane()
                .overlay(
                    DishGalleryViewContent()
                )
                .gesture(
                    DragGesture()
                        .onChanged { (value) in
                            print("Gallery.gesture")
                            self.translationY = value.translation.height
                    }
                    .onEnded { (value) in
                        let snapDistance = 0.2 * Screen.height
                        let endTranslation = value.predictedEndTranslation.height
                        if endTranslation > snapDistance {
                            self.store.send(.closeGallery)
                        }
                        withAnimation(.spring()) {
                            self.translationY = 0.0
                        }
                    }
            )
            
            DishGalleryOverlayView()
        }
        .edgesIgnoringSafeArea(.all)
        .disabled(hidden ? true : false)
        .opacity(hidden ? 0 : 1)
        .offset(y: translationY)
        .animation(Animation.spring())
    }
}

struct DishGalleryPane: View {
    @EnvironmentObject var store: AppStore
    @State private var translationY = CGFloat(0.0)

    var body: some View {
        Color
            .black
            .opacity(0.5)
            .edgesIgnoringSafeArea(.all)
            .frameFlex()
    }
}

#if DEBUG
struct DishGalleryView_Previews: PreviewProvider {
    static var previews: some View {
        DishGalleryView()
    }
}
#endif
