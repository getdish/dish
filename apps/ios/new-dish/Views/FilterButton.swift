import SwiftUI

struct FilterButton: View {
    var label: String
    var action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(label)
                .foregroundColor(Color.white.opacity(0.85))
                .font(.system(size: 14))
        }
        .padding(.vertical, 7)
        .padding(.horizontal, 12)
        .background(
            Color(hue: 0, saturation: 0, brightness: 0.2).opacity(0.9)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 80)
                .stroke(Color.white.opacity(0.25), lineWidth: 2)
        )
            .cornerRadius(80)
            .shadow(color: Color.black.opacity(0.5), radius: 7, x: 0, y: 2)
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


