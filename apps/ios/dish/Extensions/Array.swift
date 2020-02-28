extension Array {
  func chunked(into size: Int) -> [[Element]] {
    var chunkedArray = [[Element]]()

    for index in 0...self.count {
      if index % size == 0 && index != 0 {
        chunkedArray.append(Array(self[(index - size)..<index]))
      } else if (index == self.count) {
        chunkedArray.append(Array(self[index - 1..<index]))
      }
    }

    return chunkedArray
  }

  func split() -> [[Element]] {
    let ct = self.count
    let half = ct / 2
    let leftSplit = self[0..<half]
    let rightSplit = self[half..<ct]
    return [Array(leftSplit), Array(rightSplit)]
  }
}
