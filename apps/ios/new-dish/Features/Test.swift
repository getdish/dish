import SwiftUI

let kImage = "hiddenlake.jpg"
let kTitle = "Stretchy header in SwiftUI"
let kPublishedAt = Date()
let kAuthor = "Author Name"
let kContent = """
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
"""

private let kHeaderHeight: CGFloat = 300

struct Content2View: View {
    
    private static let formatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        formatter.timeStyle = .short
        return formatter
    }()
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading) {
                GeometryReader { (geometry: GeometryProxy) in
                    if geometry.frame(in: .global).minY <= 0 {
                        Image(kImage).resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(width: geometry.size.width,
                                   height: geometry.size.height)
                    } else {
                        Image(kImage).resizable()
                            .aspectRatio(contentMode: .fill)
                            .offset(y: -geometry.frame(in: .global).minY)
                            .frame(width: geometry.size.width,
                                   height: geometry.size.height
                                    + geometry.frame(in: .global).minY)
                    }
                }.frame(maxHeight: kHeaderHeight)
                
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Text("\(kPublishedAt, formatter: Self.formatter)")
                            .foregroundColor(.secondary)
                            .font(.caption)
                        
                        Spacer()
                        
                        Text("Author: \(kAuthor)")
                            .foregroundColor(.secondary)
                            .font(.caption)
                    }
                    
                    Text(kTitle)
                        .font(.headline)
                    
                    Text(kContent)
                        .font(.body)
                }.frame(idealHeight: .greatestFiniteMagnitude)
                    .padding()
            }
        }.edgesIgnoringSafeArea(.top)
    }
    
}

#if DEBUG
struct Content2View_Previews: PreviewProvider {
    static var previews: some View {
        Content2View()
    }
}
#endif
