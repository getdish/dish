import SwiftUI

struct BottomNav: View {
    @EnvironmentObject var store: AppStore
    let hiddenButtonY: CGFloat = 100
    
    var body: some View {
        let isOnGallery = store.state.galleryDish != nil
        
        return VStack {
            Spacer()
            ZStack {
                HStack {
                    DishMapButton()
                        .animation(.spring(response: 0.5))
                        .opacity(0)
                        .offset(y: isOnGallery ? hiddenButtonY : 0)
                    Spacer()
                    DishFiltersButton()
                        .animation(.spring(response: 0.75))
                        .offset(y: isOnGallery ? hiddenButtonY : 0)
                    Spacer()
                    BottomNavCircularButton(image: "camera", size: 48, action: {
                        homePager.animateTo(1)
                    })
                        .animation(.spring(response: 0.5))
                        .offset(y: isOnGallery ? hiddenButtonY : 0)
                }
                
                HStack {
//                    DishBackButton()
//                        .opacity(0.5)
//                        .animation(.spring(response: 0.5))
//                        .offset(y: !isOnGallery ? hiddenButtonY : 0)
                    Spacer()
                    BottomNavCircularButton(image: "xmark", size: 50, action: {
                        print("CLOSE THAT SHIT")
                        self.store.send(.closeGallery)
                    })
                        .animation(.spring(response: 0.75))
                        .offset(y: !isOnGallery ? hiddenButtonY : 0)
                    Spacer()
//                    DishForwardButton()
//                        .animation(.spring(response: 0.5))
//                        .offset(y: !isOnGallery ? hiddenButtonY : 0)
                }
            }
            .padding(.horizontal)
            Spacer()
                .frame(height: 60)
        }
    }
}


struct DishFiltersButton: View {
    var body: some View {
        BottomNavButton {
            HStack(spacing: 14) {
                Group {
                    Image(systemName: "dollarsign.circle").resizable().scaledToFit()
                    Image(systemName: "tag.fill").resizable().scaledToFit()
                    Image(systemName: "car.fill").resizable().scaledToFit()
                }
                .foregroundColor(.white)
                .frame(width: 26, height: 26)
            }
        }
    }
}

struct DishMapButton: View {
    var body: some View {
        BottomNavCircularButton(image: "map", size: 40)
    }
}

struct DishStarButton: View {
    var body: some View {
        BottomNavCircularButton(image: "star", size: 60)
    }
}

struct DishBackButton: View {
    var body: some View {
        BottomNavCircularButton(image: "chevron.left.circle.fill", size: 50)
    }
}

struct DishForwardButton: View {
    var body: some View {
        BottomNavCircularButton(image: "chevron.right.circle.fill", size: 50)
    }
}

typealias ActionFn = (() -> Void)

struct BottomNavCircularButton: View {
    var image: String
    var size: CGFloat = 40
    var action: ActionFn? = nil
    var body: some View {
        BottomNavButton(action: self.action) {
            Image(systemName: self.image)
                .resizable()
                .scaledToFit()
                .foregroundColor(.white)
        }
        .frame(width: size, height: size)
    }
}

struct BottomNavButton<Content>: View where Content: View {
    var action: ActionFn? = nil
    let content: () -> Content
    
    init(action: ActionFn? = nil, @ViewBuilder content: @escaping () -> Content) {
        self.action = action
        self.content = content
    }
    
    var body: some View {
        Button(action: {
            if let cb = self.action {
                cb()
            }
        }) {
            self.content()
        }
        .padding(.all, 12)
        .background(
            BlurView(style: .systemMaterialDark)
        )
            .background(
                LinearGradient(
                    gradient: Gradient(colors: [Color.white.opacity(0.4),
                                                Color.white.opacity(0.5)]),
                    startPoint: .top,
                    endPoint: .bottom
                )
        )
            .cornerRadius(80)
            .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 8)
            .overlay(
                RoundedRectangle(cornerRadius: 80)
                    .stroke(Color.white.opacity(0.5), lineWidth: 1)
        )
    }
}
