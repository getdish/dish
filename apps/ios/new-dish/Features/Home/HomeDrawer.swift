import SwiftUI
import Combine

struct HomeDrawer: View {
    @State var showDrawer = true
    
    var body: some View {
        ZStack {
            // Dark background when open
            Rectangle()
                .animation(.spring())
                .foregroundColor(.black)
                .opacity(self.showDrawer ? 0.25 : 0.0)
                .disabled(!self.showDrawer)
                .onTapGesture {
                    self.showDrawer.toggle()
                    Keyboard.hide()
            }
            
            BottomSheetView(
                isOpen: self.$showDrawer,
                maxHeight: homeInitialDrawerFullHeight,
                snapRatio: 0.1,
                indicator: AnyView(
                    HStack {
                        BarArrow(direction: self.showDrawer ? .down : .up)
                            .padding(.vertical, 16)
                    }
                    .frame(maxWidth: .infinity)
                    .onTapGesture {
                        self.showDrawer.toggle()
                    }
                )
            ) {
                HomeDrawerContent()
            }
        }
    }
}

// Temporary views

struct TagsBar: View {
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack {
                Tag {Image("uber").resizable().frame(width: 42, height: 42)}
                Tag {Image("postmates").resizable().frame(width: 42, height: 42)}
                Tag {Image("doordash").resizable().frame(width: 42, height: 42)}
                Tag {Image("grubhub").resizable().frame(width: 42, height: 42)}
            }
            .padding(.vertical, 8)
            .padding(.horizontal)
        }
    }
}

struct Tag<Content>: View where Content: View {
    let content: () -> Content
    
    init(@ViewBuilder content: @escaping () -> Content) {
        self.content = content
    }
    
    var body: some View {
        HStack {
            content()
        }
        .padding(.vertical, 0)
        .padding(.horizontal, 9)
        .background(Color(.tertiarySystemBackground).opacity(0.9))
        .cornerRadius(5)
        .shadow(color: Color.black.opacity(0.18), radius: 2, y: 2)
    }
}
