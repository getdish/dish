import SwiftUI

struct HomeBottomNav: View {
    var body: some View {
        VStack {
            Spacer()
            HStack {
                DishMapButton()
                Spacer()
                DishHomeButton()
                Spacer()
                DishCameraButton()
            }
            .padding(.horizontal)
            Spacer()
                .frame(height: 80)
        }
    }
}


struct DishHomeButton: View {
    var body: some View {
        BottomNavButton {
            Text("Filters")
                .foregroundColor(.white)
                .font(.system(size: 20.0))
                .fontWeight(.bold)
        }
    }
}

struct DishCameraButton: View {
    var body: some View {
        BottomNavButton {
            Image(systemName: "camera")
                .resizable()
                .foregroundColor(.white)
        }
        .frame(width: 40, height: 40)
    }
}

struct DishMapButton: View {
    var body: some View {
        BottomNavButton {
            Image(systemName: "map")
                .resizable()
                .foregroundColor(.white)
        }
        .frame(width: 40, height: 40)
    }
}


struct BottomNavButton<Content>: View where Content: View {
    let content: () -> Content
    
    init(@ViewBuilder content: @escaping () -> Content) {
        self.content = content
    }
    
    var body: some View {
        Button(action: {
//            action()
        }) {
            self.content()
        }
        .padding(.all, 12)
        .background(
            BlurView(style: .systemUltraThinMaterial)
        )
            .background(
                LinearGradient(
                    gradient: Gradient(colors: [Color.white.opacity(0.1),
                                                Color.white.opacity(0.2)]),
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
