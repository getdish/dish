import SwiftUI

enum AlertIntent {
  case info, success, question, danger, warning
}

struct InlineAlertView: View {

  var title: String
  var subtitle: String?
  var intent: AlertIntent = .info

  var body: some View {
    HStack(alignment: VerticalAlignment.top) {
      Image(systemName: "exclamationmark.triangle.fill")
        .padding(.vertical)
        .foregroundColor(Color.white)

      VStack(alignment: .leading) {
        Text(self.title)
          .font(.body)
          .fontWeight(.bold)
          .multilineTextAlignment(.leading)
          .lineLimit(nil)

        //        if (self.subtitle != nil) {
        //          Text(self.subtitle!)
        //            .font(.body)
        //            .multilineTextAlignment(.leading)
        //            .lineLimit(nil)
        //        }

      }.padding(.leading)
    }
      .padding()
      .background(Color.red)
      .cornerRadius(8)

  }
}

#if DEBUG
  struct InlineAlertView_Previews: PreviewProvider {
    static var previews: some View {
      InlineAlertView(
        title: "Lorem Ipsum.",
        subtitle: "Dolor sit amet.",
        intent: .info
      ).frame(height: 200)
    }
  }
#endif
