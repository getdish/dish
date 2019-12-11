import SwiftUI

struct HomeDrawerContent: View {
    @State var searchText = ""
    @State var scrollAtTop = true
    let items = features.chunked(into: 2)
    
    init() {
        UINavigationBar.appearance().backgroundColor = .clear
    }
    
    var body: some View {
        VStack(spacing: 3) {
            VStack(spacing: 3) {
                SearchInput(
                    placeholder: "Pho, Burger, Salad...",
                    inputBackgroundColor: Color(.secondarySystemGroupedBackground),
                    scale: self.scrollAtTop ? 1.25 : 1.0,
                    sizeRadius: 2.0,
                    searchText: self.$searchText
                )
                    .padding(.horizontal)
                
                TagsBar()
            }
            
            ScrollView {
                VStack(spacing: 6) {
                    ForEach(0 ..< self.items.count) { index in
                        HStack(spacing: 6) {
                            ForEach(self.items[index]) { item in
                                DishCard(landmark: item)
                            }
                        }
                    }
                    
                    // bottom padding
                    Spacer().frame(height: 40)
                }
            }
            .padding(.horizontal, 6)
        }
    }
}


// Temporary views

struct DishCard: View {
    var landmark: Landmark
    
    var body: some View {
        FeatureCard(landmark: landmark, at: .start)
            .cornerRadius(14)
            .onTapGesture {
                //                Store.home.dish = self.landmark
        }
    }
}

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


#if DEBUG
struct HomeDrawerContent_Previews: PreviewProvider {
    static var previews: some View {
        HomeDrawer()
    }
}
#endif
