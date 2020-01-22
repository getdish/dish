import SwiftUI
import CoreLocation

struct TopNavSearchResults: View {
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        ZStack {
            BlurView(style: .systemThickMaterial)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            
            VStack {
                Spacer().frame(height: 100)
                
                List {
                    Spacer()
                    // TODO we need Identifiable
                    // store.state.locationSearchResults
//                    ForEach([]) { result in
//                        Button(action: {
////                            self.mapSearch.search = "\(result.name)"
////                            self.mapSearch.showResults = false
//                        }) {
//                            HStack {
//                                VStack {
//                                    Text("\(result.name)")
//                                }
//                            }
//                        }
//                        .background(Color("transparent"))
//                    }
//                    .listRowBackground(Color("transparent"))
                }
                .background(Color("transparent"))
                .listRowBackground(Color("transparent"))
            }
        }
        .opacity(store.state.map.showSearch ? 1 : 0)
        .disabled(!store.state.map.showSearch)
        .animation(.spring())
    }
}
