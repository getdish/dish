import SwiftUI

struct HomeMapOverlay: View {
    @Environment(\.colorScheme) var colorScheme
    
    var body: some View {
        ZStack {
            ZStack {
                BlurView(style: colorScheme == .light
                    ? .systemUltraThinMaterialLight
                    : .systemUltraThinMaterialDark
                )
            }
            .clipShape(
                topCornerMask(
                    width: App.screen.width,
                    height: App.screen.height,
                    cornerRadius: 30
                )
            )
            
            ZStack {
                LinearGradient(
                    gradient: Gradient(
                        colors: [Color.red, Color.blue]
                        //                    self.colorScheme == .light
                        //                        ? [Color.black.opacity(0), Color(white: 0.1).opacity(1)]
                        //                        : [Color.black.opacity(0), Color(white: 0).opacity(1)]
                    ),
                    startPoint: .top,
                    endPoint: .bottom
                )
                    .opacity(self.colorScheme == .light ? 0.25 : 0.85)
                
                LinearGradient(
                    gradient: Gradient(
                        colors: [Color.black, Color.clear]
                    ),
                    startPoint: .top,
                    endPoint: .bottom
                )
                    .opacity(self.colorScheme == .light ? 0.25 : 0.85)
            }
            .clipShape(
                topCornerMask(
                    width: App.screen.width,
                    height: App.screen.height,
                    cornerRadius: 30
                )
            )
                .drawingGroup()
            
            ZStack {
                LinearGradient(
                    gradient: Gradient(colors: [Color.black.opacity(0), Color(white: 0).opacity(0.075)]),
                    startPoint: .center,
                    endPoint: .bottom
                )
                LinearGradient(
                    gradient: Gradient(colors: [Color.black.opacity(0), Color(white: 0).opacity(0.075)]),
                    startPoint: .center,
                    endPoint: .trailing
                )
                LinearGradient(
                    gradient: Gradient(colors: [Color.black.opacity(0), Color(white: 0).opacity(0.075)]),
                    startPoint: .center,
                    endPoint: .leading
                )
            }
            .mask(
                LinearGradient(
                    gradient: Gradient(colors: [Color.black.opacity(0), Color.black.opacity(1)]),
                    startPoint: .top,
                    endPoint: .center
                )
            )
                .drawingGroup()
        }
    }
}

