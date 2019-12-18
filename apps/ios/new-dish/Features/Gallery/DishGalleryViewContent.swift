import SwiftUI

struct Cutout {
    let cardFrame = CGRect(
        x: 0, y: 0, width: Screen.width - 16, height: Screen.height + 142
    )
    var clipPath = Path()
    init() {
        clipPath.cardControlsCutout(rect: cardFrame, circleSize: 75)
    }
}
let clipPath = Cutout().clipPath

struct DishGalleryViewContent: View {
    @EnvironmentObject var store: AppStore
    @State var currentIndex = 0
    
    var body: some View {
        ZStack {
            VStack(alignment: .leading) {
                VerticalCardPager(
                    pageCount: 2,
                    currentIndex: self.$currentIndex
                ) {
                    Spacer()
                        .frame(height: 580)

                    DishGalleryDish(
                        name: "Pho",
                        items: features
                    )
                    
                    DishGalleryDish(
                        name: "Ramen",
                        items: features
                    )
                }
            }
            .clipShape(clipPath)
            
            HStack {
                Spacer()
                BottomNavButton {
                    Image(systemName: "chevron.right.circle.fill")
                        .resizable()
                        .foregroundColor(.white)
                }
                .frame(width: 60, height: 60)
                .offset(x: 2, y: 32)
            }
        }
        .environment(\.colorScheme, .dark)
    }
}

struct VerticalCardPager<Content: View>: View {
    @Binding var currentIndex: Int
    let pageCount: Int
    let content: Content
    let height: CGFloat = 580
    
    init(
        pageCount: Int,
        currentIndex: Binding<Int>,
        @ViewBuilder content: @escaping () -> Content
    ) {
        self.pageCount = pageCount
        self._currentIndex = currentIndex
        self.content = content()
    }
    
    @GestureState private var translation: CGFloat = 0
    
    enum Lock { case on, off, none }
    @State var lockedTo: Lock = .none
    
    var body: some View {
        GeometryReader { geometry in
            VStack(alignment: .leading, spacing: 0) {
                self.content
            }
            .frame(height: geometry.size.height, alignment: .leading)
            .background(Color.black.opacity(0.0001))
            .offset(y: -CGFloat(self.currentIndex) * self.height)
            .offset(y: self.translation)
            .animation(.spring(response: 0.4))
            .simultaneousGesture(
                DragGesture(minimumDistance: 10.0).updating(self.$translation) { value, state, _ in
                    let x = value.translation.width
                    let y = value.translation.height
                    
                    print("\(x) \(y)")
                    
                    DispatchQueue.main.async {
                        if self.lockedTo == .none {
                            if abs(x) < 10 && abs(y) > 10 {
                                self.lockedTo = .on
                            }
                            if abs(x) > 10 && abs(y) < 10 {
                                self.lockedTo = .off
                            }
                        }
                    }
                    
                    if self.lockedTo == .off {
                        state = 0
                    } else {
                        state = value.translation.height
                    }
                }.onEnded { value in
                    let offset = value.translation.height / self.height
                    let newIndex = (CGFloat(self.currentIndex) - offset).rounded()
                    self.currentIndex = min(max(Int(newIndex), 0), self.pageCount - 1)
                    DispatchQueue.main.async {
                        self.lockedTo = .none
                    }
                }
            )
        }
    }
}

struct DishGalleryDish: View {
    var name: String
    var items: [Landmark]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 5) {
            HStack {
                Text(self.name)
                    .font(.system(size: 27))
                    .bold()
                    .shadow(color: Color.black.opacity(0.4), radius: 2, x: 1, y: 2)
                
                Spacer()
            }
            .padding(.horizontal)
            
            DishGalleryDishCards(
                items: items
            )
        }
    }
}

struct DishGalleryDishCards: View {
    @Environment(\.geometry) var appGeometry
    private var geometry: GeometryProxy { appGeometry! }
    
    var items: [Landmark]
    
    struct CardAnimation {
        enum Target { case cur, prev }
        var x: CGFloat = 0
        var target: Target = .cur
        var animateToX = false
    }
    
    @State private var animation: CardAnimation = CardAnimation(x: 0, target: .cur)
    @State private var curIndex = 0
    
    var width: CGFloat = 0
    
    var body: some View {
        print("render")
        
        let animation = self.animation
        let curCard = DishGalleryCard(active: true, landmark: items[curIndex])
        let nextCard = DishGalleryCard(landmark: items[curIndex + 1])
        let prevCard = DishGalleryCard(landmark: items[max(0, curIndex - 1)])
        
        let curCardWrapped = (
            ZStack {
                curCard
                // if you want rotation effect do inside ZStack here:
                //                    .rotation3DEffect(
                //                            .degrees(20.0),
                //                            axis: (0.0, 1.0, 1.0)
                //                    )
            }
            .offset(x: animation.target == .cur ? animation.x : 0)
            .animation(animation.target == .cur && animation.animateToX ? .spring(response: 0.3) : nil)
        )
        
        return ZStack {
            nextCard
                .animation(.spring())
                .rotationEffect(.degrees(2.5))
            
            curCardWrapped
                .simultaneousGesture(
                    DragGesture()
                        .onChanged { value in
                            let x = value.translation.width
                            if self.curIndex == 0 && x > 0 {
                                print("already at start")
                                return
                            }
                            self.animation = CardAnimation(
                                x: x,
                                target: x > 0 ? .prev : .cur,
                                animateToX: false
                            )
                    }.onEnded { value in
                        let frameWidth = self.geometry.size.width
                        let offset = value.translation.width / frameWidth
                        print("end \(offset) \(frameWidth)")
                        if abs(offset) > 0.35 {
                            let newIndex = Int((CGFloat(self.curIndex) - offset).rounded())
                            print("newIndex \(newIndex)")
                            if newIndex < 0 {
                                return
                            }
                            
                            if newIndex > self.curIndex {
                                // next card
                                self.animation = CardAnimation(
                                    x: -frameWidth,
                                    target: .cur,
                                    animateToX: true
                                )
                            } else {
                                // prev card
                                self.animation = CardAnimation(
                                    x: frameWidth,
                                    target: .prev,
                                    animateToX: true
                                )
                                
                            }
                            
                            // reset state
                            DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(300)) {
                                print("finish animation")
                                self.animation = CardAnimation(
                                    x: 0,
                                    target: .cur,
                                    animateToX: false
                                )
                                self.curIndex = newIndex
                            }
                        } else {
                            print("under threshold reset it")
                            if self.animation.target == .cur {
                                self.animation = CardAnimation(
                                    x: 0,
                                    target: .cur,
                                    animateToX: true
                                )
                            } else {
                                self.animation = CardAnimation(
                                    x: -frameWidth,
                                    target: .prev,
                                    animateToX: true
                                )
                            }
                        }
                })
            
            prevCard
                .animation(animation.target == .prev && animation.animateToX ? .spring(response: 0.3) : nil)
                .offset(x: -geometry.size.width + (animation.target == .prev ? animation.x : 0))
        }
            // for now hardcoded
            .frame(height: 500)
            .padding()
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
    static var mock = Store<AppState, AppAction>.init(
        initialState: AppState(
            galleryDish: features[0]
        ),
        reducer: appReducer
    )
    
    static var previews: some View {
        ZStack {
            Color.black
            DishGalleryViewContent()
                .environmentObject(self.mock)
        }
    }
}
#endif


