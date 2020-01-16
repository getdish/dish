import SwiftUI

fileprivate func getId(_ dish: DishItem) -> String {
    "feature-\(dish.id)"
}

struct FeatureCard: View, Equatable, Identifiable {
    var dish: DishItem
    var aspectRatio: CGFloat = 2 / 2.25
    let id: Int
    var at: MagicItemPosition? = nil
    
    init(dish: DishItem, aspectRatio: CGFloat = 2 / 2.5, at: MagicItemPosition? = nil) {
        self.dish = dish
        self.aspectRatio = aspectRatio
        self.id = self.dish.id
        self.at = at
    }
    
    var body: some View {
        print("render featurecard")
        let content = self.dish.image
            .resizable()
            .aspectRatio(aspectRatio, contentMode: .fit)
            .overlay(TextOverlay(name: self.dish.name))
        return VStack {
            if self.at != nil {
                MagicItem(getId(self.dish), at: at!) {
                    content
                }
            } else {
                content
            }
        }
    }
}

struct TextOverlay: View {
    var name: String
    
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
                Text(name)
                    .font(.system(size: 20))
                    .bold()
                //        Text(dish.park)
            }
            .padding()
        }
        .foregroundColor(.white)
    }
}

struct FeatureCard_Previews: PreviewProvider {
    static var previews: some View {
        FeatureCard(dish: features[0])
    }
}
