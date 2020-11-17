#!/bin/bash

url='
  https://www.tripadvisor.com/DynamicPlacementAjax?
  detail=1516973
  &albumViewMode=hero
  &placementRollUps=responsive-photo-viewer
  &metaReferer=Restaurant_Review&
  offset=0
'

url=$(echo "$url" | tr -d "[:space:]")

curl -H 'X-Requested-With: XMLHttpRequest' "$url"
