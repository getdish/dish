import SwiftUI

struct DishGalleryViewContent: View {
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        ZStack {
            VStack(spacing: 4) {
                DishGalleryCards()
            }
        }
        .environment(\.colorScheme, .dark)
    }
}

struct DishGalleryCards: View {
    let cards = features
    
    enum AnimateTarget {
        case cur, prev
    }
    
    @State private var animating: AnimateTarget = .cur

    @State private var prevTranslateX: CGFloat = 0
    @State private var translationX: CGFloat = 0
    // temp workaround because no withAnimation callback
    @State private var finishDragX: CGFloat = 0
    @State private var isFinishingAnimation = false
    @State private var curIndex = 0
    
    var body: some View {
        print("render")
        
        let curCard = FeatureCard(landmark: features[curIndex]).cornerRadius(10)
        let nextCard = FeatureCard(landmark: features[curIndex + 1]).cornerRadius(0)
        let prevCard = FeatureCard(landmark: features[max(0, curIndex - 1)]).cornerRadius(50)
        
        return GeometryReader { geometry in
            ZStack {
                nextCard
                
                ZStack {
                    curCard
                        .shadow(
                            color: Color.black.opacity(0.4), radius: 10, x: 0, y: 0
                    )
                    //                        .rotation3DEffect(
                    //                            .degrees(20.0),
                    //                            axis: (0.0, 1.0, 1.0)
                    //                    )
                }
                .offset(x: self.animating == .cur ? self.translationX + (self.isFinishingAnimation ? self.finishDragX : 0) : 0)
                .animation(self.isFinishingAnimation ? .spring(response: 0.3) : nil)
                .gesture(
                    DragGesture(minimumDistance: 0, coordinateSpace: .global)
                        .onChanged { value in
                            let x = value.translation.width
                            if self.curIndex == 0 && x > 0 {
                                print("already at start")
                                return
                            }
                            self.animating = x > 0 ? .prev : .cur
                            self.translationX = x
                    }.onEnded { value in
                        let frameWidth = geometry.size.width
                        let offset = value.translation.width / frameWidth
                        print("end \(offset) \(frameWidth)")
                        if abs(offset) > 0.35 {
                            let newIndex = Int((CGFloat(self.curIndex) - offset).rounded())
                            print("newIndex \(newIndex)")
                            if newIndex < 0 {
                                return
                            }
                            
                            if newIndex < self.curIndex {
                                self.translationX = 0
                                self.prevTranslateX = frameWidth
                            } else {
                                self.finishDragX = self.translationX - frameWidth
                                self.isFinishingAnimation = true
                                self.translationX = 0
                            }
                            
                            // reset state
                            DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(300)) {
                                print("finish animation")
                                self.animating = .cur
                                self.isFinishingAnimation = false
                                self.finishDragX = 0
                                self.curIndex = newIndex
                            }
                        } else {
                            withAnimation(.spring(response: 0.3)) {
                                self.translationX = 0
                            }
                        }
                    }
                )
                
                prevCard
                    .animation(self.animating == .prev ? .spring(response: 0.3) : nil)
                    .offset(x: -geometry.size.width + (self.animating == .prev ? self.translationX + self.prevTranslateX : 0))
            }
            .padding()
        }
    }
}



struct DishGalleryTopNav: View {
    var body: some View {
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
        }
        .frame(height: Screen.height * 0.1)
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
struct DishGalleryViewContent_Previews: PreviewProvider {
    static var previews: some View {
        DishGalleryViewContent()
    }
}
#endif


