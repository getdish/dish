import SwiftUI

struct DishCuisineFilterPopup: View {
    @EnvironmentObject var screen: ScreenModel
    @EnvironmentObject var store: AppStore
    
    @State var active: String = ""
    
    let continentNames = ["African", "Asian", "European", "North American", "South American"]

    let continents: [String: [String]] = [
        "African": ["🇺🇸 American", "🇲🇽 Mexican"],
        "Asian": ["🇺🇸 American", "🇲🇽 Mexican"],
        "European": ["🇺🇸 American", "🇲🇽 Mexican"],
        "North American": ["🇺🇸 American", "🇲🇽 Mexican"],
        "South American": ["🇺🇸 American", "🇲🇽 Mexican"]
    ]
    
    var activeCountries: [String] {
        if let selected = self.continents[active] {
            return selected
        }
        return []
    }
    
    var body: some View {
        let activeCountries = self.activeCountries
        
        return ZStack {
            Color.black.opacity(0.3)
                .onTapGesture {
                    self.store.send(.home(.toggleShowCuisineFilter))
            }
            
            VStack {
                if self.active == "" {
                    VStack {
                        Text("Continent")
                            .style(.h1)
                        
                        GridView(rows: 2, cols: 3) { row, col, index -> AnyView in
                            let name = self.continentNames[index]
                            return AnyView(
                                Button(action: {
                                    self.active = name
                                }) {
                                    IconView(
                                        label: name
                                    )
                                        .padding(.vertical, 10)
                                }
                            )
                        }
                    }
                } else {
                    VStack {
                        List {
                            ForEach(0 ..< activeCountries.count) { index in
                                Button(action: {
                                    let cuisineFlag = "\(activeCountries[index].prefix(1))"
                                    self.store.send(.home(.setCuisineFilter(cuisineFlag)))
                                    self.active = ""
                                    self.store.send(.home(.toggleShowCuisineFilter))
                                }) {
                                    Text("\(activeCountries[index])")
                                }
                            }
                        }
                    }
                }
            }
            .padding(20)
            .frame(
                width: self.screen.width - 20,
                height: self.screen.width - 20
            )
                .background(
                    BlurView(style: .light)
            )
                .cornerRadius(50)
                .clipped()
        }
    }
}

struct IconView: View {
    var background: AnyView = AnyView(Color.red)
    var cornerRadius: CGFloat = 16
    var image: Image = Image(systemName: "star")
    var imageSize: CGFloat = 32
    var padding: CGFloat = 12
    var label: String = "Hello World"
    var labelStyle: Text.Style = .iconLabel
    
    var body: some View {
        VStack {
            self.image
                .resizable()
                .scaledToFit()
                .frame(width: self.imageSize, height: self.imageSize)
                .padding(self.padding)
                .background(self.background)
                .clipShape(RoundedRectangle(cornerRadius: self.cornerRadius, style: .continuous))
            
            VStack(alignment: .center) {
                Text(self.label)
                    .style(self.labelStyle)
                    .lineLimit(1)
            }
        }
    }
}

struct GridView<Content: View>: View {
    let rows: Int
    let cols: Int
    let content: (Int, Int, Int) -> Content
    let spacing: CGFloat
    
    init(
        rows: Int,
        cols: Int,
        spacing: CGFloat = 12,
        @ViewBuilder content: @escaping (Int, Int, Int) -> Content
    ) {
        self.rows = rows
        self.cols = cols
        self.spacing = spacing
        self.content = content
    }
    
    var body: some View {
        GeometryReader { geometry in
            VStack(spacing: self.spacing) {
                ForEach(0 ..< self.rows, id: \.self) { row in
                    HStack(spacing: self.spacing) {
                        ForEach(0 ..< self.cols, id: \.self) { column in
                            self
                                .content(row, column, row * column + column)
                                .frame(width: geometry.size.width / CGFloat(self.cols), alignment: .center)
                        }
                    }
                }
            }
            .frame(width: geometry.size.width, alignment: .center)
        }
    }
}
