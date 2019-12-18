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
    @State private var sideDrawerShown = false
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
//                SideDrawerView(
//                    isOpen: self.$sideDrawerShown,
//                    content: {
//                        HomeViewContent(height: geometry.size.height)
//                    },
//                    drawer: {
//                        // TODO @majid it shows DishSidebarView() if i uncomment DishSidebarView
//                        EmptyView().frame(height: 100)
//    //                   DishSidebarView()
//                    }
//                )
                
                HomeViewContent(height: geometry.size.height)
                
                HomeTopBar()
            }
            .background(
                self.colorScheme == .light ? Color.white : Color.black.opacity(0.8)
            )
        }
        .embedInGeometryReader()
        .edgesIgnoringSafeArea(.all)
    }
}

struct HomeViewContent: View {
    var height: CGFloat = 0
    @EnvironmentObject var store: AppStore
    @State private var index = 0

    var body: some View {
        ZStack {
            PagerView(
                pageCount: 3,
                currentIndex: self.$index
            ) {
                HomeDishView()
                Image(systemName: "photo").resizable()
                Button(action: { self.index = 0 }) {
                    Text("Go to first page")
                }
            }
            .onChangePage { index in
                self.store.send(.changeHomePage(index == 0 ? .home : .camera))
            }
            
            BottomNav()
        }
        .frame(maxHeight: self.height)
    }
}


struct HomeView_Previews: PreviewProvider {
    static var previews: some View {
        HomeView()
           .embedInAppEnvironment(Mocks.galleryVisibleDish)
    }
}
