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
        ZStack {
            SideDrawerView(
                isOpen: self.$sideDrawerShown,
                content: {
                    HomeViewContent()
                },
                drawer: {
                    // TODO @majid it shows DishSidebarView() if i uncomment DishSidebarView
                    EmptyView()
//                   DishSidebarView()
                }
            )
            
            HomeTopBar()
        }
        .background(
            self.colorScheme == .light ? Color.white : Color.black.opacity(0.8)
        )
        .edgesIgnoringSafeArea(.all)
        .embedInGeometryReader()
    }
}

struct HomeViewContent: View {
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
            
            HomeBottomNav()
        }
    }
}


struct HomeView_Previews: PreviewProvider {
    static var previews: some View {
        HomeView()
    }
}
