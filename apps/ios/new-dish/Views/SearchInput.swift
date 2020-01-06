import SwiftUI

struct EmptyModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
    }
}

struct SearchInputTag: Identifiable, Equatable {
    var color: Color
    var text: String
    var deletable: Bool = true
    var id: String {
        "\(color.hashValue)\(text)"
    }
}

struct SearchInput: View {
    var placeholder = "Search"
    var inputBackgroundColor = Color(.secondarySystemBackground)
    var borderColor = Color.clear
    var borderWidth = 1.0
    var blur = 0
    var scale = CGFloat(1)
    var sizeRadius = CGFloat(1)
    var icon: AnyView?
    var showCancelInside = false
    var onEditingChanged: ((Bool) -> Void)?
    var onCancel: (() -> Void)?
    var after: AnyView?
    
    @Binding var searchText: String
    @Binding var tags: [SearchInputTag]
    
    @State private var showCancelButton: Bool = false
    
    func handleEditingChanged(isEditing: Bool) {
        self.showCancelButton = isEditing
        
        if let cb = onEditingChanged {
            cb(isEditing)
        }
    }
    
    var cancelButton: some View {
        Button("Cancel") {
            UIApplication.shared.endEditing(true) // this must be placed before the other commands here
            self.searchText = ""
            self.showCancelButton = false
            if let cb = self.onCancel {
                cb()
            }
        }
        .foregroundColor(Color(.systemBlue))
    }
    
    var body: some View {
        let pad = 8 * (scale + 0.5) * 0.5
        let numTags = self.tags.count
        let hasTags = numTags > 0
        let fontSize = 14 * scale
        
        return VStack {
            // Search view
            HStack {
                HStack(spacing: 4 * scale) {
                    (icon ?? AnyView(Image(systemName: "magnifyingglass")))
                        .frame(width: 24 * scale, height: 24 * scale)
                    
                    if hasTags {
                        HStack {
                            ForEach(self.tags) { tag in
                                HStack {
                                    Text(tag.text)
                                        .font(.system(size: fontSize))
                                        .foregroundColor(Color.white)
                                        .padding(4)
                                        .background(tag.color)
                                        .cornerRadius(4)
                                    
                                    if tag.deletable {
                                        Image(systemName: "xmark")
                                    }
                                }
                                .onTapGesture {
                                    if tag.deletable {
                                        if let index = self.tags.firstIndex(of: tag) {
                                            self.tags.remove(at: index)
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    TextField(
                        hasTags ? "" : self.placeholder,
                        text: self.$searchText,
                        onEditingChanged: self.handleEditingChanged,
                        onCommit: {
                            print("onCommit")
                        }
                    )
                        .disableAutocorrection(true)
                        .font(.system(size: fontSize))
                        .foregroundColor(.primary)

                    Button(action: {
                        self.searchText = ""
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .opacity(self.searchText == "" ? 0.0 : 1.0)
                            .frame(width: 24 * scale, height: 24 * scale)
                    }
                    
                    if showCancelButton && showCancelInside {
                        cancelButton
                            .scaleEffect(0.9)
                    }
                    
                    if after != nil {
                        after
                            .frame(width: 24 * scale, height: 24 * scale)
                    }
                }
                    .padding(EdgeInsets(
                        top: pad,
                        leading: pad,
                        bottom: pad,
                        trailing: pad
                    ))
                    .foregroundColor(.secondary)
                    .background(self.inputBackgroundColor)
                    .cornerRadius(10.0 * scale * sizeRadius)
                    .shadow(color: Color.black.opacity(0.24), radius: 15, x: 0, y: 0)
                    .overlay(
                        RoundedRectangle(cornerRadius: 10.0 * scale * sizeRadius)
                            .stroke(self.borderColor, lineWidth: 1)
                    )
                
                if showCancelButton && !showCancelInside {
                    cancelButton
                }
            }
                .navigationBarHidden(showCancelButton) // .animation(.default) // animation does not work properly
        }
    }
}

extension UIApplication {
    func endEditing(_ force: Bool) {
        self.windows
            .filter{$0.isKeyWindow}
            .first?
            .endEditing(force)
    }
}

#if DEBUG
struct SearchInputPreview: View {
    @State var searchText = ""
    @State var tags: [SearchInputTag] = []

    var body: some View {
        VStack {
            SearchInput(searchText: $searchText, tags: $tags)
            SearchInput(scale: 1.25, searchText: $searchText, tags: $tags)
        }
    }
}
struct SearchInput_Previews: PreviewProvider {
    static var previews: some View {
        SearchInputPreview()
    }
}
#endif
