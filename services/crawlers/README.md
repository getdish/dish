
## Worker

Crawlers send their jobs to the worker to be run: `nodemon _/worker.js`

View the status of jobs on the worker:

```
docker run \
  --name orkid-ui \
  --net host \
  --rm \
  orkidio/orkid-ui:latest
```

## Crawlers

Once the worker is running send jobs to it, eg: `node _/ubereats_sanfran.js`

## Notes

Example request for restaurants in New York
`curl 'https://www.ubereats.com/api/getFeedV1?localeCode=en-US' -H 'x-csrf-token: x' -H 'Cookie: uev2.loc=%7B%22address%22%3A%7B%22address1%22%3A%223rd%20Avenue%22%2C%22address2%22%3A%223rd%20Ave%2C%20New%20York%2C%20NY%22%2C%22aptOrSuite%22%3A%22%22%2C%22city%22%3A%22%22%2C%22country%22%3A%22%22%2C%22eaterFormattedAddress%22%3A%223rd%20Ave%2C%20New%20York%2C%20NY%2C%20USA%22%2C%22postalCode%22%3A%22%22%2C%22region%22%3A%22%22%2C%22subtitle%22%3A%223rd%20Ave%2C%20New%20York%2C%20NY%22%2C%22title%22%3A%223rd%20Avenue%22%2C%22uuid%22%3A%22%22%7D%2C%22latitude%22%3A40.767489999999995%2C%22longitude%22%3A-73.96227999999999%2C%22reference%22%3A%22EhozcmQgQXZlLCBOZXcgWW9yaywgTlksIFVTQSIuKiwKFAoSCQEnDDLqWMKJEZ4VmpRLqnJ3EhQKEgk7CD_TpU_CiRFi_nfhBo8LyA%22%2C%22referenceType%22%3A%22google_places%22%2C%22type%22%3A%22google_places%22%2C%22source%22%3A%22manual_auto_complete%22%7D;' --data '{}' | jq -c '.[0]' | vd -f jsonl`

Example restaurant:
```json
{
  singleUseItemsInfo: { title: 'Add utensils, straws, etc.' },
  sectionEntitiesMap: {
    '7c78f8ea-dc4c-4df4-9251-519db5188be3': {
      'e50a2a4a-d0d1-4a7b-900e-13c88b2da671': [Object],
      ...
    }
  },
  sections: [
    {
      subsectionUuids: [Array],
      title: 'Menu',
      subtitle: '11:00 AM – 11:00 PM',
      uuid: '7c78f8ea-dc4c-4df4-9251-519db5188be3',
      isTop: true,
      isOnSale: true
    }
  ],
  subsectionsMap: {
    'f564d238-e0ca-4c72-8182-209ba8689699': {
      itemUuids: [Array],
      subtitle: '',
      title: 'Archived-Extras',
      uuid: 'f564d238-e0ca-4c72-8182-209ba8689699',
      displayType: null
    },
    ...
  },
  title: 'Brick Oven Pizza 33 (3rd Ave)',
  uuid: '998c179a-44c8-4490-8455-feb1ea3c2806',
  cityId: 5,
  categories: [ '$', 'Pizza', 'American', 'Italian' ],
  cuisineList: [ 'Pizza', 'American', 'Italian' ],
  priceBucket: '$',
  etaRange: { text: '30–40 min', iconUrl: '' },
  ratingBadge: null,
  disclaimerBadge: null,
  distanceBadge: null,
  fareBadge: null,
  fareInfo: { serviceFeeCents: null },
  promotion: null,
  shouldIndex: true,
  heroImageUrls: [
    {
      url: 'https://d1ralsognjng37.cloudfront.net/8bf56736-6adf-4cec-b611-0a40ebfd0753.jpeg',
      width: 240
    },
    {
      url: 'https://d1ralsognjng37.cloudfront.net/c18f7bd8-b27f-45c6-8fdf-e5e774fbfd50.jpeg',
      width: 550
    },
    {
      url: 'https://d1ralsognjng37.cloudfront.net/9560dc62-f8bb-4c3a-a9b2-ea4bb0af8916.jpeg',
      width: 640
    },
    {
      url: 'https://d1ralsognjng37.cloudfront.net/455a0e8c-1d5a-447a-8d9e-d4feaf09011d.jpeg',
      width: 750
    },
    {
      url: 'https://d1ralsognjng37.cloudfront.net/d2d2dc05-700c-4111-9e35-5f0c77f4bf74.jpeg',
      width: 1080
    },
    {
      url: 'https://d1ralsognjng37.cloudfront.net/03403f90-b7ab-4779-8a86-ac945c29fab8.jpeg',
      width: 2880
    }
  ],
  isOpen: true,
  currencyCode: 'USD',
  closedMessage: 'Currently unavailable',
  location: {
    address: '489 3rd Ave, New York, NY 10016',
    streetAddress: '489 3rd Ave',
    city: 'New York',
    country: 'US',
    postalCode: '10016',
    region: 'NY',
    latitude: 40.7450725,
    longitude: -73.9782852
  },
  isDeliveryBandwagon: false,
  isDeliveryOverTheTop: false,
  isDeliveryThirdParty: false,
  hours: [ { dayRange: 'Every Day', sectionHours: [Array] } ],
  disableOrderInstruction: false,
  disableCheckoutInstruction: false,
  nuggets: [],
  isWithinDeliveryRange: true,
  slug: 'brick-oven-pizza-33-3rd-ave',
  citySlug: 'new-york',
  phoneNumber: '+13477395171',
  metaJson: '{"@context":"http:\\u002F\\u002Fschema.org","@type":"Restaurant","@id":"https:\\u002F\\u002Fwww.ubereats.com\\u002Fen-US\\u002Fnew-york\\u002Ffood-delivery\\u002Fbrick-oven-pizza-33-3rd-ave\\u002FmYwXmkTIRJCEVf6x6jwoBg\\u002F","name":"Brick Oven Pizza 33 (3rd Ave)","servesCuisine":["Pizza","American","Italian"],"priceRange":"$","image":["https:\\u002F\\u002Fd1ralsognjng37.cloudfront.net\\u002F8bf56736-6adf-4cec-b611-0a40ebfd0753.jpeg","https:\\u002F\\u002Fd1ralsognjng37.cloudfront.net\\u002Fc18f7bd8-b27f-45c6-8fdf-e5e774fbfd50.jpeg","https:\\u002F\\u002Fd1ralsognjng37.cloudfront.net\\u002F9560dc62-f8bb-4c3a-a9b2-ea4bb0af8916.jpeg","https:\\u002F\\u002Fd1ralsognjng37.cloudfront.net\\u002F455a0e8c-1d5a-447a-8d9e-d4feaf09011d.jpeg","https:\\u002F\\u002Fd1ralsognjng37.cloudfront.net\\u002Fd2d2dc05-700c-4111-9e35-5f0c77f4bf74.jpeg","https:\\u002F\\u002Fd1ralsognjng37.cloudfront.net\\u002F03403f90-b7ab-4779-8a86-ac945c29fab8.jpeg"],"potentialAction":{"@type":"OrderAction","target":{"@type":"EntryPoint","urlTemplate":"https:\\u002F\\u002Fwww.ubereats.com\\u002Fen-US\\u002Fnew-york\\u002Ffood-delivery\\u002Fbrick-oven-pizza-33-3rd-ave\\u002FmYwXmkTIRJCEVf6x6jwoBg\\u002F?utm_campaign=order-action&utm_medium=organic","inLanguage":"English","actionPlatform":["http:\\u002F\\u002Fschema.org\\u002FDesktopWebPlatform","http:\\u002F\\u002Fschema.org\\u002FMobileWebPlatform"]},"deliveryMethod":["http:\\u002F\\u002Fpurl.org\\u002Fgoodrelations\\u002Fv1#DeliveryModeOwnFleet","http:\\u002F\\u002Fpurl.org\\u002Fgoodrelations\\u002Fv1#DeliveryModePickUp"]},"address":{"@type":"PostalAddress","addressLocality":"New York","addressRegion":"NY","postalCode":"10016","addressCountry":"US","streetAddress":"489 3rd Ave"},"geo":{"@type":"GeoCoordinates","latitude":40.7450725,"longitude":-73.9782852},"telephone":"+13477395171","aggregateRating":{},"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],"opens":"11:0","closes":"23:0"}]}',
  promoTrackings: [],
  suggestedPromotion: { text: '', promotionUuid: '' },
  supportedDiningModes: [
    {
      mode: 'DELIVERY',
      title: 'Delivery',
      isSelected: true,
      isAvailable: true
    },
    {
      mode: 'PICKUP',
      title: 'Pickup',
      isSelected: false,
      isAvailable: true
    }
  ],
  isPreview: false,
  isFavorite: false,
  pinnedInfo: null
}
```
