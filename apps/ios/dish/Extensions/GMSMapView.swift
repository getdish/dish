//import GoogleMaps
//
//// radius calculation/conversion
//extension GMSMapView {
//    func getCenterCoordinate() -> CLLocationCoordinate2D {
//        let centerPoint = self.center
//        let centerCoordinate = self.projection.coordinate(for: centerPoint)
//        return centerCoordinate
//    }
//
//    func getTopCenterCoordinate() -> CLLocationCoordinate2D {
//        // to get coordinate from CGPoint of your map
//        let topCenterCoor = self.convert(CGPoint(x: self.frame.size.width, y: 0), from: self)
//        let point = self.projection.coordinate(for: topCenterCoor)
//        return point
//    }
//    
//    func getCenterLocation() -> CLLocation {
//        let centerCoordinate = getCenterCoordinate()
//        return CLLocation(latitude: centerCoordinate.latitude, longitude: centerCoordinate.longitude)
//    }
//    
//    func getTopCenterLocation() -> CLLocation {
//        let topCenterCoordinate = self.getTopCenterCoordinate()
//        return CLLocation(latitude: topCenterCoordinate.latitude, longitude: topCenterCoordinate.longitude)
//    }
//
//    func getRadius() -> CLLocationDistance {
//        return round(CLLocationDistance(getCenterLocation().distance(from: getTopCenterLocation())))
//    }
//}
