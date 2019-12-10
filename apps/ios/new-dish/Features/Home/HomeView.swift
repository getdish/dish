//
//  HomeView.swift
//  new-dish
//
//  Created by Majid Jabrayilov on 12/5/19.
//  Copyright © 2019 Majid Jabrayilov. All rights reserved.
//
import SwiftUI

struct HomeView: View {
    @Environment(\.colorScheme) var colorScheme: ColorScheme
    @State private var index = 1
    
    var body: some View {
        ZStack {
            HomeMap()
            
            PagerView(
                pageCount: 3,
                currentIndex: self.$index
            ) { index in
                if index == 0 {
                    Color.red
                } else if index == 1 {
                    Image(systemName: "photo")
                        .resizable()
                } else {
                    Button("Go to first page") {
                        self.index = 0
                    }
                }
            }
        }
        .background(
            self.colorScheme == .light ? Color.white : Color.black.opacity(0.8)
        )
        .edgesIgnoringSafeArea(.all)
    }
}

struct HomeView_Previews: PreviewProvider {
    static var previews: some View {
        HomeView()
    }
}
