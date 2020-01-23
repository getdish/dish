import SwiftUI

struct FilterButton: View {
    @Environment(\.colorScheme) var colorScheme
    var width: CGFloat? = nil
    var label: String
    var action: () -> Void
    var flex: Bool = false
    var cornerRadiusCorners: UIRectCorner = .allCorners
    
    var body: some View {
        let textColor = Color(.systemBackground).opacity(0.85)
        let schemeOppositeColor = Color(colorScheme == .dark ? .init(white: 0.95, alpha: 0.9) : .init(white: 0.15, alpha: 0.9))
        let shadowColor = Color(.black).opacity(colorScheme == .light ? 0.6 : 0.3)
        return ZStack {
            CustomButton2(action: action) {
                HStack {
                    if flex {
                        Spacer()
                    }
                    Text(label)
                        .foregroundColor(textColor)
                        .font(.system(size: 14))
                        .lineLimit(1)
                    if flex {
                        Spacer()
                    }
                }
                .frame(width: self.width)
                .padding(.vertical, 7)
                .padding(.horizontal, 10)
                .background(schemeOppositeColor)
//                .cornerRadius(100, corners: self.cornerRadiusCorners)
                .shadow(color: shadowColor, radius: 7, x: 0, y: 2)
            }
        }
    }
}


struct FilterButtonStrong: View {
    var label: String
    var action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(label)
                .foregroundColor(.white)
                .fontWeight(.semibold)
                .font(.system(size: 14))
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 12)
        .background(Color.blue.opacity(0.35))
        .overlay(
            RoundedRectangle(cornerRadius: 80)
                .stroke(Color.white, lineWidth: 1)
        )
            .cornerRadius(80)
            .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 8)
    }
}


