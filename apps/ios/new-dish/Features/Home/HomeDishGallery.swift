import SwiftUI

struct HomeDishGallery: View {
    @EnvironmentObject var store: AppStore
    var shown = false
    @State private var translation = CGSize.zero
    @State private var translationY = CGFloat(0.0)
    
    var body: some View {
        let hidden = shown == true ? false : self.store.state.galleryDish == nil
        
        return ZStack {
            Color
                .black
                .opacity(0.5)
                .edgesIgnoringSafeArea(.all)
                .frameFlex()
                .overlay(
                    ZStack {
                        BlurView(style: .systemUltraThinMaterial)
                            .frameFlex()
                        
                        VStack(spacing: 4) {
                            Spacer()
                            HStack(alignment: .bottom) {
                                VStack(alignment: .leading) {
                                    Spacer()
                                    ScrollView(.horizontal) {
                                        HStack(alignment: .bottom) {
                                            CategoryLabel(name: "Pho", size: 28.0)
                                            CategoryLabel(name: "Ramen", size: 16.0)
                                                .opacity(0.5)
                                            CategoryLabel(name: "Noodle Soup", size: 16.0)
                                                .opacity(0.5)
                                            CategoryLabel(name: "Thai", size: 16.0)
                                                .opacity(0.5)
                                            Spacer()
                                        }
                                    }
                                }
                                .padding(.horizontal)
                                .padding(.top, 20)
                                .frameFlex()
                            }
                            .frameFlex()
                            .frame(height: Screen.height * 0.3)
                            
                            ScrollView {
                                VStack(spacing: 0) {
                                    ExampleCard(landmark: features[0])
                                    ExampleCard(landmark: features[1])
                                    ExampleCard(landmark: features[2])
                                    ExampleCard(landmark: features[3])
                                }
                            }
                        }
                    }
                    .environment(\.colorScheme, .dark)
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
            
            VStack {
                Spacer()
                Button(action: {
                    self.store.send(.closeGallery)
                }) {
                    HStack {
                        Image(systemName: "xmark")
                            .imageScale(.large)
                            .foregroundColor(.white)
                    }
                    .frameFlex()
                }
                .background(
                    LinearGradient(
                        gradient: Gradient(colors: [Color("brandBackground").opacity(0.1),
                                                    Color("brandBackgroundDarker").opacity(0.2)]),
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                    .frame(width: 60, height: 60, alignment: .trailing)
                    .cornerRadius(80)
                    .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 8)
                    .overlay(
                        RoundedRectangle(cornerRadius: 80)
                            .stroke(Color.white.opacity(0.5), lineWidth: 1)
                )
                    .opacity(self.store.state.galleryDish == nil ? 0.0 : 1.0)
                    .animation(Animation.spring(response: 0.3).delay(0.15))
            }
            .padding(.bottom, 30)
        }
        .edgesIgnoringSafeArea(.all)
        .disabled(hidden ? true : false)
        .opacity(hidden ? 0 : 1)
        .offset(y: translationY)
        .animation(Animation.spring())
    }
}

struct ExampleCard: View {
    var disabled = false
    var landmark: Landmark
    var body: some View {
        VStack {
            FeatureCard(landmark: landmark, at: .end)
                .overlay(
                    disabled ? Rectangle().foregroundColor(Color.black.opacity(0.5)).cornerRadius(14) : nil
            )
        }
        .padding(.horizontal, 4)
    }
}

struct CategoryLabel: View {
    var name: String
    var place: String?
    var size = 18.0
    var body: some View {
        VStack(alignment: .trailing) {
            Text(name)
                .font(.system(size: CGFloat(size)))
                .fontWeight(.bold)
                .shadow(color: Color.black.opacity(0.4), radius: 2, x: 1, y: 2)
            Text(place ?? "")
                .shadow(color: Color.black.opacity(0.4), radius: 2, x: 1, y: 2)
        }
        .padding(.horizontal, 14)
    }
}

#if DEBUG
struct HomeDishGallery_Previews: PreviewProvider {
    static var previews: some View {
        HomeDishGallery(shown: true)
    }
}
#endif
