import SwiftUI

struct DishGalleryCardStack: View {
    var name: String
    var items: [Landmark]
    
    @Environment(\.geometry) var appGeometry
    
    var body: some View {
        let store = CardStackStore(
            items: items,
            geometry: appGeometry
        )

        return ZStack {
            VStack(alignment: .leading, spacing: 0) {
                HStack {
                    TagView {
                        Text(self.name)
                            .font(.system(size: 26))
                            .bold()
                            .shadow(color: Color.black.opacity(0.4), radius: 2, x: 1, y: 2)
                            .padding(.vertical, 4)
                            .padding(.horizontal, 4)
                    }
                    
                    Spacer()
                }
                .padding(.horizontal, 30)
                .padding(.bottom, 10)
                
                ZStack {
                    DishGalleryCardStackCards(
                        cardStackStore: store
                    )
                    
                    // controls
                    ZStack {
                        VStack {
                            Spacer()
                            HStack {
                                Spacer()
                                BottomNavButton(action: {
                                    print("update it...")
                                    store.next()
                                }) {
                                    Image(systemName: "chevron.right.circle")
                                        .resizable()
                                        .foregroundColor(.white)
                                }
                                .frame(width: 54, height: 54)
                            }
                            Spacer()
                        }
                        
                        VStack {
                            Spacer()
                            HStack {
                                Spacer()
                                BottomNavButton {
                                    Image(systemName: "star")
                                        .resizable()
                                        .foregroundColor(.white)
                                }
                                .frame(width: 45, height: 45)
                            }
                        }
                    }
                }
                .frame(height: 520)
            }
        }
    }
}

struct CardAnimation {
    enum Target { case cur, prev }
    enum Status { case dragging, animating, idle }
    var x: CGFloat = 0
    var y: CGFloat = 0
    var rotateY: Double = 0
    var target: Target = .cur
    var status: Status = .idle
}

class CardStackStore: ObservableObject {
    var items: [Landmark]
    @Published var index: Int = 0
    @Published var animation: CardAnimation = CardAnimation(x: 0, target: .cur)
    var geometry: GeometryProxy? = nil
    
    init(items: [Landmark], geometry: GeometryProxy?) {
        self.items = items
        self.geometry = geometry
    }
    
    func animate(_ animation: CardAnimation, index: Int? = nil) {
        self.animation = animation
        let shouldFinish = animation.status != .dragging && animation.status != .idle
        if shouldFinish {
            DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(300)) {
                self.animate(
                    CardAnimation(
                        x: 0,
                        y: 0,
                        target: .cur,
                        status: .idle
                    )
                )
                if let i = index {
                    self.index = i
                }
            }
        } else {
            if let i = index {
                self.index = i
            }
        }
    }
    
    func next() {
        if geometry == nil { return }
        // at end
        if index + 1 > items.count - 1 { return }
        self.animate(
            CardAnimation(
                x: -geometry!.size.width,
                y: 0,
                target: .cur,
                status: .animating
            ),
            index: self.index + 1
        )
    }
}

struct DishGalleryCardStackCards: View {
    @ObservedObject var cardStackStore: CardStackStore
    var width: CGFloat = 0
    
    var body: some View {
        let items = cardStackStore.items
        let geometry = cardStackStore.geometry!
        let animation = cardStackStore.animation
        let index = cardStackStore.index
        let isIdle = animation.status == .idle
        let curCard = DishGalleryCard(name: "Miss Saigon", active: true, landmark: items[index])
        let prevCard = DishGalleryCard(landmark: items[max(0, index - 1)])
        
        print("render2 .. \(animation.status) to (\(animation.x), \(animation.y))")
        
        return ZStack {
            // below card
            if index < items.count - 1 {
                DishGalleryCard(name: "Pho 2000", landmark: items[index + 1])
                    .rotationEffect(.degrees(animation.status == .idle ? 2.5 : 0.0))
                    .animation(.spring())
            }
            
            // current card
            GeometryReader { cardGeometry in
                ZStack {
                    curCard
                        .rotationEffect(.degrees(animation.rotateY))
                        .animation(isIdle ? nil : .linear(duration: 0.1))
                }
                .offset(
                    x: animation.target == .cur ? animation.x : 0,
                    y: animation.y
                )
                    .animation(animation.target == .cur && !isIdle
                        ? .spring(response: 0.3)
                        : nil
                )
                    .simultaneousGesture(
                        DragGesture()
                            .onChanged { value in
                                let x = value.translation.width
                                let y = value.translation.height
                                let isDragging = animation.status == .dragging
                                let isStartingDrag = !isDragging
                                
                                // if at beginning
                                if index == 0 && x > 0 {
                                    if x > 20 {
                                        // do a little shake or something
                                    }
                                    if !isDragging {
                                        return
                                    }
                                }
                                
                                var rotateY: Double = animation.rotateY
                                
                                // on start drag, rotate it based on where they grabbed at
                                if isStartingDrag {
                                    let cardFrameHeight = cardGeometry.size.height
                                    let grabbedYAt = value.location.y
                                    let grabYPct = Double(grabbedYAt / cardFrameHeight)
                                    let maxRotationDeg = 10.0
                                    if grabYPct > 0.5 {
                                        rotateY = Double((grabYPct - 0.5) * maxRotationDeg)
                                    } else {
                                        rotateY = Double(-(0.5 - grabYPct) * maxRotationDeg)
                                    }
                                }
                                
                                self.cardStackStore.animate(
                                    CardAnimation(
                                        x: x,
                                        y: y,
                                        rotateY: rotateY,
                                        // only change target on start of drag
                                        target: isStartingDrag
                                            ? (x > 0 ? .prev : .cur)
                                            : animation.target,
                                        status: .dragging
                                    )
                                )
                        }.onEnded { value in
                            let frameWidth = geometry.size.width
                            let offset = value.translation.width / frameWidth
                            let offsetV = value.predictedEndTranslation.width / frameWidth
                            
                            // we can tune this score now based on various factors
                            let score = abs(offset * 0.4 + offsetV * 0.6)
                            let shouldChange = score > 0.2
                            let newIndex = shouldChange
                                ? index + (offset > 0 ? -1 : 1)
                                : index
                            
                            print("score \(score) -- \(offset) \(offsetV)")
                            
                            if shouldChange {
                                print("newIndex \(newIndex), curIndex \(index)")
                                if newIndex < 0 {
                                    return
                                }
                                
                                let y = value.predictedEndTranslation.height
                                
                                if newIndex > index {
                                    print("next card x \(-frameWidth) y \(y)")
                                    // next card
                                    self.cardStackStore.animate(
                                        CardAnimation(
                                            x: -frameWidth,
                                            y: y,
                                            target: .cur,
                                            status: .animating
                                        ),
                                        index: newIndex
                                    )
                                } else {
                                    // prev card
                                    self.cardStackStore.animate(
                                        CardAnimation(
                                            x: frameWidth,
                                            y: 0,
                                            target: .prev,
                                            status: .animating
                                        ),
                                        index: newIndex
                                    )
                                    
                                }
                            } else {
                                print("under threshold reset it")
                                if animation.target == .cur {
                                    self.cardStackStore.animate(
                                        CardAnimation(
                                            x: 0,
                                            y: 0,
                                            target: .cur,
                                            status: .animating
                                        )
                                    )
                                } else {
                                    self.cardStackStore.animate(
                                        CardAnimation(
                                            x: -frameWidth,
                                            y: 0,
                                            target: .prev,
                                            status: .animating
                                        )
                                    )
                                }
                            }
                    })
            }
            
            // above card (off screen)
            prevCard
                .animation(animation.target == .prev && !isIdle
                    ? .spring(response: 0.3)
                    : nil
            )
                .offset(
                    x: -geometry.size.width + (animation.target == .prev && !isIdle ? animation.x : 0),
                    y: animation.target == .prev ? animation.y : 0
            )
        }
            // for now hardcoded
            .frame(height: 500)
            .padding(.horizontal, 12)
            .padding(.bottom, 25)
            .padding(.top, 6)
    }
}


#if DEBUG
struct DishGalleryCardStack_Previews: PreviewProvider {
    static var previews: some View {
        ZStack {
            Color.black
            DishGalleryCardStack(
                name: "Pho",
                items: features
            )
        }
        .embedInAppEnvironment(Mocks.galleryVisibleDish)
    }
}
#endif


