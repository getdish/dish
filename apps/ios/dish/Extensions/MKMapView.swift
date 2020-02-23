import Foundation
import MapKit

extension MKMapView {
    func MERCATOR_RADIUS() -> Double {
        return 85445659.44705395
    }
    
    func MERCATOR_OFFSET() -> Double {
        return 268435456.0
    }
    
    func longitudeToPixelSpaceX(longitude: Double) -> Double {
        return round(MERCATOR_OFFSET() + MERCATOR_RADIUS() * longitude * .pi / 180.0);
    }
    
    func latitudeToPixelSpaceY(latitude: Double) -> Double {
        return round( Double(Float(MERCATOR_OFFSET()) - Float(MERCATOR_RADIUS()) * logf((1 + sinf(Float(latitude * .pi / 180.0))) / (1 - sinf(Float(latitude * .pi / 180.0)))) / Float(2.0)))
    }
    
    func pixelSpaceXToLongitude(pixelX: Double) -> Double {
        return ((round(pixelX) - MERCATOR_OFFSET()) / MERCATOR_RADIUS()) * 180.0 / .pi;
    }
    
    func pixelSpaceYToLatitude(pixelY: Double) -> Double {
        return (.pi / 2.0 - 2.0 * atan(exp((round(pixelY) - MERCATOR_OFFSET()) / MERCATOR_RADIUS()))) * 180.0 / .pi;
    }
    
    func coordinateSpanWithMapView(centerCoordinate: CLLocationCoordinate2D, zoomLevel: Double) -> MKCoordinateSpan  {
        let mapView: MKMapView = self
        // convert center coordiate to pixel space
        let centerPixelX = self.longitudeToPixelSpaceX(longitude: centerCoordinate.longitude)
        let centerPixelY = self.latitudeToPixelSpaceY(latitude: centerCoordinate.latitude)
        
        // determine the scale value from the zoom level
        let zoomExponent = Double(20 - zoomLevel)
        let zoomScale = pow(2.0, zoomExponent)
        
        // scale the map’s size in pixel space
        let mapSizeInPixels = mapView.bounds.size
        let scaledMapWidth = Double(mapSizeInPixels.width) * zoomScale
        let scaledMapHeight = Double(mapSizeInPixels.height) * zoomScale;
        
        // figure out the position of the top-left pixel
        let topLeftPixelX = centerPixelX - (scaledMapWidth / 2);
        let topLeftPixelY = centerPixelY - (scaledMapHeight / 2);
        
        // find delta between left and right longitudes
        let minLng = self.pixelSpaceXToLongitude(pixelX: topLeftPixelX)
        let maxLng = self.pixelSpaceXToLongitude(pixelX: topLeftPixelX + scaledMapWidth)
        let longitudeDelta = maxLng - minLng;
        
        // find delta between top and bottom latitudes
        let minLat = self.pixelSpaceYToLatitude(pixelY: topLeftPixelY)
        let maxLat = self.pixelSpaceYToLatitude(pixelY: topLeftPixelY + scaledMapHeight)
        let latitudeDelta = -1 * (maxLat - minLat)
        
        // create and return the lat/lng span
        return MKCoordinateSpan.init(latitudeDelta: latitudeDelta, longitudeDelta: longitudeDelta)
    }
    
    func zoomLevel() -> Double {
        let centerPixelSpaceX = self.longitudeToPixelSpaceX(longitude: self.centerCoordinate.longitude)
        let lonLeft = self.centerCoordinate.longitude - (self.region.span.longitudeDelta / 2)
        let leftPixelSpaceX = self.longitudeToPixelSpaceX(longitude: lonLeft)
        let pixelSpaceWidth = abs(centerPixelSpaceX - leftPixelSpaceX) * 2
        let zoomScale = pixelSpaceWidth / Double(self.bounds.size.width)
        let zoomExponent = self.logC(val: zoomScale, forBase: 2)
        let zoomLevel = 20 - zoomExponent
        return zoomLevel
    }
    
    func logC(val: Double, forBase base: Double) -> Double {
        return log(val) / log(base)
    }
    
    func setCenterCoordinate(centerCoordinate: CLLocationCoordinate2D, zoomLevel: Double, animated: Bool) {
        // clamp large numbers to 28
        let zoomLevel = min(zoomLevel, 28)
        // use the zoom level to compute the region
        let span = self.coordinateSpanWithMapView(centerCoordinate: centerCoordinate, zoomLevel: zoomLevel)
        let region = MKCoordinateRegion.init(center: centerCoordinate, span: span)
        // set the region like normal
        self.setRegion(region, animated: animated)
    }
}

