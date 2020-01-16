//
//  ContentView.swift
//  new-dish
//
//  Created by Majid Jabrayilov on 12/5/19.
//  Copyright © 2019 Majid Jabrayilov. All rights reserved.
//
import SwiftUI

fileprivate let cardPad: CGFloat = 10.0

struct RootView: View {
    var height: CGFloat = Screen.height
    var total = features.count - 4
    
    @Environment(\.geometry) var appGeometry
    @State var dir: Axis.Set = .vertical {
        willSet(val) {
            if val == .horizontal {
                self.finalDir = val
            } else {
                async(400) {
                    self.finalDir = val
                }
            }
        }
    }
    @State var finalDir: Axis.Set = .vertical
    
    var cardWidth: CGFloat {
        switch dir {
            case .vertical: return Screen.width - 20
            case .horizontal: return 160.0
            default: return 0
        }
    }
    var cardHeight: CGFloat {
        switch dir {
            case .vertical: return Screen.width - 20
            case .horizontal: return 160.0 * (1/1.8)
            default: return 0
        }
    }
    
    var innerWidth: CGFloat {
        finalDir == .vertical ? appGeometry?.size.width ?? Screen.width : CGFloat(total) * (cardWidth + cardPad)
    }
    
    var innerHeight: CGFloat {
        finalDir == .horizontal ? height : CGFloat(total) * (cardHeight + cardPad)
    }
    
    func leftIndex(_ x: Int) -> CGFloat {
        dir == .vertical ? 0 : CGFloat(x) * (cardWidth + cardPad)
    }
    
    func topIndex(_ y: Int) -> CGFloat {
        dir == .horizontal ? 0 : CGFloat(y) * (cardHeight + cardPad)
    }
    
    var body: some View {
        VStack {
            ZStack {
                ScrollView(finalDir) {
                    ZStack {
                        VStack {
                            HStack {
                                ZStack {
                                    ForEach(0 ..< total) { index in
                                        DishCardView(
                                            dish: features[index],
                                            display: self.dir == .vertical ? .full : .card
                                        )
                                            .frame(width: self.cardWidth, height: self.cardHeight)
                                            .shadow(color: Color.black.opacity(0.5), radius: 8, x: 0, y: 3)
                                            .offset(x: self.leftIndex(index), y: self.topIndex(index))
                                    }
                                }
                                .frame(
                                    width: cardWidth,
                                    height: cardHeight
                                )
                                Spacer()
                            }
                            Spacer()
                        }
                    }
                    .frame(
                        width: innerWidth,
                        height: innerHeight
                    )
                }
                .frame(
                    width: appGeometry?.size.width,
                    height: height
                )
                .animation(.spring())
                
                Button(action: {
                    self.dir = self.dir == .vertical ? .horizontal : .vertical
                }) {
                    Text("Gooo")
                }
            }
            .padding(.top, Screen.statusBarHeight * 2)
            .frame(height: height)
            .clipped()
            
            Spacer()
        }
//        ContextMenuRootView {
//            HomeContainerView()
//        }
    }
}

struct DishCardView: View, Identifiable {
    enum DisplayCard {
        case card, full, fullscreen
    }
    var id: Int { dish.id }
    var dish: DishItem
    var display: DisplayCard = .full
    var body: some View {
        GeometryReader { geometry in
            FeatureCard(dish: self.dish, aspectRatio: geometry.size.width / geometry.size.height, at: .start)
                .cornerRadius(14)
                .onTapGesture {
                    App.store.send(
                        .home(.push(HomeStateItem(filters: [SearchFilter(name: self.dish.name)])))
                    )
            }
        }
    }
}

struct RootView_Previews: PreviewProvider {
    static var previews: some View {
        RootView()
    }
}
