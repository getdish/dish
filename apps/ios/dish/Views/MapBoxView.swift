import SwiftUI
import Mapbox
import MapboxAnnotationExtension

extension MGLPointAnnotation {
    convenience init(title: String, coordinate: CLLocationCoordinate2D) {
        self.init()
        self.title = title
        self.coordinate = coordinate
    }
}

struct MapBoxView: UIViewRepresentable {
    @Binding var annotations: [MGLPointAnnotation]
    
    private let mapView: MGLMapView = MGLMapView(frame: .zero, styleURL: MGLStyle.darkStyleURL)
    
    // MARK: - Configuring UIViewRepresentable protocol
    
    func makeUIView(context: UIViewRepresentableContext<MapBoxView>) -> MGLMapView {
        mapView.delegate = context.coordinator
        mapView.autoresizingMask = [.flexibleHeight, .flexibleWidth]
        
//        let layer = MGLSymbolStyleLayer(identifier: "coffeeshops", source: features)
//        layer.sourceLayerIdentifier = "pois"
//        layer.iconImageName = NSExpression(forConstantValue: "coffee")
//        layer.iconScale = NSExpression(forConstantValue: 0.5)
//        layer.text = NSExpression(forKeyPath: "name")
//        layer.textTranslation = NSExpression(forConstantValue: NSValue(cgVector: CGVector(dx: 10, dy: 0)))
//        layer.textJustification = NSExpression(forConstantValue: "left")
//        layer.textAnchor = NSExpression(forConstantValue: "left")
//        layer.predicate = NSPredicate(format: "%K == %@", "venue-type", "coffee")
//        mapView.style?.addLayer(layer)
        
        return mapView
    }
    
    func updateUIView(_ uiView: MGLMapView, context: UIViewRepresentableContext<MapBoxView>) {
        updateAnnotations()
    }
    
    func makeCoordinator() -> MapBoxView.Coordinator {
        Coordinator(self)
    }
    
    // MARK: - Configuring MGLMapView
    
    func styleURL(_ styleURL: URL) -> MapBoxView {
        mapView.styleURL = styleURL
        return self
    }
    
    func centerCoordinate(_ centerCoordinate: CLLocationCoordinate2D) -> MapBoxView {
        mapView.centerCoordinate = centerCoordinate
        return self
    }
    
    func zoomLevel(_ zoomLevel: Double) -> MapBoxView {
        mapView.zoomLevel = zoomLevel
        return self
    }
    
    private func updateAnnotations() {
        if let currentAnnotations = mapView.annotations {
            mapView.removeAnnotations(currentAnnotations)
        }
        mapView.addAnnotations(annotations)
    }
    
    // MARK: - Implementing MGLMapViewDelegate
    
    final class Coordinator: NSObject, MGLMapViewDelegate {
        var control: MapBoxView
        
        init(_ control: MapBoxView) {
            self.control = control
        }
        
        func mapView(_ mapView: MGLMapView, didFinishLoading style: MGLStyle) {
            
            let coordinates = [
                CLLocationCoordinate2D(latitude: 37.791329, longitude: -122.396906),
                CLLocationCoordinate2D(latitude: 37.791591, longitude: -122.396566),
                CLLocationCoordinate2D(latitude: 37.791147, longitude: -122.396009),
                CLLocationCoordinate2D(latitude: 37.790883, longitude: -122.396349),
                CLLocationCoordinate2D(latitude: 37.791329, longitude: -122.396906),
            ]
            
            let buildingFeature = MGLPolygonFeature(coordinates: coordinates, count: 5)
            let shapeSource = MGLShapeSource(identifier: "buildingSource", features: [buildingFeature], options: nil)
            mapView.style?.addSource(shapeSource)
            
            let fillLayer = MGLFillStyleLayer(identifier: "buildingFillLayer", source: shapeSource)
            fillLayer.fillColor = NSExpression(forConstantValue: UIColor.blue)
            fillLayer.fillOpacity = NSExpression(forConstantValue: 0.5)
            
            mapView.style?.addLayer(fillLayer)
            
            let attraction = UIImage(named: "pin")
            if let styleImage = attraction {
                mapView.style?.setImage(styleImage, forName: "attraction")
            }
            let symbolAnnotationController = MGLSymbolAnnotationController(mapView: mapView)
            
            symbolAnnotationController.textVariableAnchor = [
                "center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right"
            ]
            
//            let symbol = MGLSymbolStyleAnnotation(coordinate: CLLocationCoordinate2DMake(37.791329, -122.396906));
//            symbol.iconImageName = "attraction"
//            symbol.text = "This is a cool place!"
//            symbol.textFontSize = 16
//            symbolAnnotationController.addStyleAnnotation(symbol)
//
//            let attraction2 = UIImage(named: "pin")
//            if let styleImage2 = attraction2 {
//                mapView.style?.setImage(styleImage2, forName: "attraction")
//            }
//            let symbol2 = MGLSymbolStyleAnnotation(coordinate: CLLocationCoordinate2DMake(37.791591, -122.396349));
//            symbol2.iconImageName = "attraction"
//            symbol2.text = "This is another cool place!"
//            symbol2.textFontSize = 18
//            symbolAnnotationController.addStyleAnnotation(symbol2)
            
        }
        
        func mapView(_ mapView: MGLMapView, viewFor annotation: MGLAnnotation) -> MGLAnnotationView? {
            return nil
        }
        
        func mapView(_ mapView: MGLMapView, annotationCanShowCallout annotation: MGLAnnotation) -> Bool {
            return true
        }
        
    }
    
}
