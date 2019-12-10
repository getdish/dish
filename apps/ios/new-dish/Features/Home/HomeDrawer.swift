import SwiftUI
import Combine

// TODO how to pass in a modifier as argument to SearchInput?
struct MainSearchFieldModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .overlay(
                RoundedRectangle(cornerRadius: 30)
                    .stroke(Color(.secondarySystemBackground), lineWidth: 2)
        )
    }
}

struct HomeDrawer: View {
    @State var showDrawer = false
    
    var body: some View {
        ZStack {
            BottomSheetView(
                isOpen: self.$showDrawer,
                maxHeight: homeInitialDrawerFullHeight
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
