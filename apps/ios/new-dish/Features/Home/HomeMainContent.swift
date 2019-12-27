import SwiftUI

struct HomeMainContent: View {
    let mapHeight: CGFloat
    let isHorizontal: Bool
    @EnvironmentObject var store: AppStore
    @State var dragX: CGFloat = 0
    
    var body: some View {
        let mapHeight = self.mapHeight
        let isOnSearchResults = AppSelect.isOnSearchResults(self.store.state)
        
        return GeometryReader { geometry in
            ZStack {
                // home
                HomeCards(isHorizontal: self.isHorizontal)
                
                // pages as you drill in below home
                if isOnSearchResults {
                    VStack {
                        Spacer().frame(height: mapHeight)
                        ForEach(1 ..< self.store.state.home.current.count) { index in
                            HomeSearchResults(
                                state: self.store.state.home.current[index]
                            )
                                .offset(
                                    x: self.dragX,
                                    y: isOnSearchResults ? 0 : 100
                            )
                                .opacity(isOnSearchResults ? 1 : 0)
                        }
                        .gesture(
                            DragGesture()
                                .onChanged { value in
                                    // right edge
                                    if value.startLocation.x < 10 {
                                        self.dragX = value.translation.width
                                    }
                            }
                            .onEnded { value in
                                let frameWidth = geometry.size.width
                                let offset = value.translation.width / frameWidth
                                let offsetV = value.predictedEndTranslation.width / frameWidth
                                let score = abs(offset * 0.4 + offsetV * 0.6)
                                let shouldChange = score > 0.2
                                withAnimation(.spring()) {
                                    self.dragX = shouldChange ? frameWidth : 0
                                }
                            }
                        )
                    }
                }
            }
            .clipped()
        }
    }
}
