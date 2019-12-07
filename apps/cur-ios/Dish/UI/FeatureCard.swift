/*
 Copyright © 2019 Apple Inc.
 
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import SwiftUI

func getLandmarkId(_ landmark: Landmark) -> String {
  "feature-\(landmark.id)"
}

struct FeatureCard: View, Identifiable {
  var landmark: Landmark
  var at: MagicItemPosition = .start
  var id = UUID()

  var body: some View {
    VStack {
      MagicItem(getLandmarkId(landmark), at: at) {
        self.landmark.image
          .resizable()
          .aspectRatio(3 / 2, contentMode: .fit)
          .overlay(TextOverlay(landmark: self.landmark))
      }
    }
  }
}

struct TextOverlay: View {
  var landmark: Landmark
  
  var gradient: LinearGradient {
    LinearGradient(
      gradient: Gradient(
        colors: [Color.black.opacity(0.6), Color.black.opacity(0)]),
      startPoint: .bottom,
      endPoint: .center)
  }
  
  var body: some View {
    ZStack(alignment: .bottomLeading) {
      Rectangle().fill(gradient)
      VStack(alignment: .leading) {
        Text(landmark.name)
          .font(.system(size: 20))
          .bold()
//        Text(landmark.park)
      }
      .padding()
    }
    .foregroundColor(.white)
  }
}

struct FeatureCard_Previews: PreviewProvider {
  static var previews: some View {
    FeatureCard(landmark: features[0])
  }
}
