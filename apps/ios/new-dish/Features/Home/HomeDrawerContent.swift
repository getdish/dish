import SwiftUI

struct HomeDrawerContent: View {
    let items = features.chunked(into: 2)
    
    init() {
        UINavigationBar.appearance().backgroundColor = .clear
    }
    
    var body: some View {
        ZStack {
            ScrollView(.vertical, showsIndicators: false) {
                Spacer().frame(height: 100)
                
                VStack(spacing: 10) {
                    ForEach(0 ..< items.count) { index in
                        HStack(spacing: 10) {
                            ForEach(self.items[index]) { item in
                                DishBrowseCard(landmark: item)
                                    .frame(width: (Screen.width - 10 * 4) / 2)
                            }
                        }
                    }
                }
                
                //                VStack(spacing: 6) {
                //                    ForEach(0 ..< 10) { index in
                //                        VStack(alignment: .leading, spacing: 6) {
                //                            ZStack {
                //                                ScrollView(.horizontal, showsIndicators: false) {
                //                                    HStack(spacing: 6) {
                //                                        ForEach(self.items) { item in
                //                                            DishBrowseCard(landmark: item)
                //                                                .frame(width: 140)
                //                                        }
                //                                    }
                //                                    .padding(.horizontal, 6)
                //                                }
                //
                //                                VStack {
                //                                    HStack {
                //                                        Tag {
                //                                            Text("Noodles")
                //                                                .fontWeight(.bold)
                //                                                .font(.system(size: 16.0))
                //                                                .opacity(0.8)
                //                                                .padding(.vertical, 5)
                //                                        }
                //                                        .padding(.horizontal, 10)
                //                                        .offset(y: -14)
                //                                        Spacer()
                //                                    }
                //
                //                                    Spacer()
                //                                }
                //                            }
                //                            Spacer().frame(height: 8)
                //                        }
                //                    }
                //
                //                    // bottom padding
                //                    Spacer().frame(height: 40)
                //                }
                //                    // avoid clipping on first title
                //                    .padding(.top, 14)
            }
            
            SearchBar()
            Spacer()
        }
    }
}

// Temporary views

struct DishBrowseCard: View {
    var landmark: Landmark
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        FeatureCard(landmark: landmark)
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
            .padding(.vertical, 50)
            .embedInAppEnvironment()
    }
}
#endif
