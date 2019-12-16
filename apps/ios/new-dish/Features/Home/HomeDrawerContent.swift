import SwiftUI

struct HomeDrawerContent: View {
    @State var searchText = ""
    @State var scrollAtTop = true
    let items = features
    
    init() {
        UINavigationBar.appearance().backgroundColor = .clear
    }
    
    var body: some View {
        VStack(spacing: 3) {
            VStack(spacing: 3) {
                SearchInput(
                    placeholder: "Pho, Burger, Salad...",
                    inputBackgroundColor: Color.white.opacity(0.5),
                    borderColor: Color.gray.opacity(0.4),
                    scale: self.scrollAtTop ? 1.25 : 1.0,
                    sizeRadius: 2.0,
                    searchText: self.$searchText
                )
                .padding(.horizontal, 8)
                
                Spacer().frame(height: 8)
//                TagsBar()
            }
            
            ScrollView {
                VStack(spacing: 6) {
                    ForEach(0 ..< 10) { index in
                        VStack(alignment: .leading, spacing: 6) {
                            HStack {
                                Text("Noodles")
                                    .fontWeight(.bold)
                                    .font(.system(size: 14.0))
                                    .opacity(0.8)
                            }
                            .padding(.horizontal, 10)

                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 6) {
                                    ForEach(self.items) { item in
                                        DishBrowseCard(landmark: item)
                                            .frame(width: 140)
                                    }
                                }
                                .padding(.horizontal, 6)
                            }
                            Spacer().frame(height: 8)
                        }
                    }
                    
                    // bottom padding
                    Spacer().frame(height: 40)
                }
            }
        }
    }
}


// Temporary views

struct DishBrowseCard: View {
    var landmark: Landmark
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        FeatureCard(landmark: landmark, at: .start)
            .cornerRadius(14)
            .onTapGesture {
                self.store.send(.setGalleryDish(self.landmark))
            }
    }
}

struct TagsBar: View {
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack {
                Tag { Text("Deliver").font(.system(size: 12.0)) }
                Tag { Text("Health").font(.system(size: 12.0)) }
                Tag { Text("Price").font(.system(size: 12.0)) }
                Tag { Text("Diet").font(.system(size: 12.0)) }
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
        HomeDrawerContent()
    }
}
#endif
