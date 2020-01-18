import SwiftUI

struct FilterButton: View {
    @Environment(\.colorScheme) var colorScheme
    var label: String
    var action: () -> Void
    
    var body: some View {
        let textColor = Color(.systemBackground).opacity(0.85)
        let schemeOppositeColor = Color(colorScheme == .dark ? .init(white: 0.95, alpha: 0.9) : .init(white: 0.15, alpha: 0.9))
        let borderColor = Color(.systemFill).opacity(0.25)
        let shadowColor = Color(.black).opacity(colorScheme == .light ? 0.3 : 0.6)
        return ZStack {
            Button(action: action) {
                Text(label)
                    .foregroundColor(textColor)
                    .font(.system(size: 14))
            }
            .padding(.vertical, 7)
            .padding(.horizontal, 12)
            .background(schemeOppositeColor)
            .overlay(RoundedRectangle(cornerRadius: 80).stroke(borderColor, lineWidth: 2))
            .cornerRadius(80)
            .shadow(color: shadowColor, radius: 7, x: 0, y: 2)
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


