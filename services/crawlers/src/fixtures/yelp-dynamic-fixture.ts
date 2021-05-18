export default {
  legacyProps: {
    props: {
      modules: {
        serverModules: [
          {
            component: 'InfoBox',
            props: {
              name: 'Test Name Yelp',
              alternateNames: [],
              rating: 4,
              reviewCount: 87,
              categories: ['Pizza', 'Sports Bars', 'Cocktail Bars'],
              isClosed: false,
              isSaved: false,
              hours: {
                todayFormatted: '11:00 am - 10:00 pm',
                yesterdayFormatted: '11:00 am - 10:00 pm',
                statusToday: 2,
                statusYesterday: 1,
                yesterdayDay: 'Sun',
                todayDay: 'Mon',
              },
              isUnclaimed: false,
              appointmentOnly: false,
              claimUrl:
                'https://biz.yelp.com/signup/B-yUH6Bc1hxy8teT4wa73A/account?utm_campaign=claim_business&amp;utm_content=claim_status_link&amp;utm_medium=m_yelp&amp;utm_source=biz_page_unclaimed',
              priceRange: 2,
              currencySymbol: '$',
            },
          },
          {
            component: 'ActionButtons',
            props: {
              phoneLink: 'tel:+14159326132',
              websiteUrl: {
                displayUrl: 'http://www.intercontinentalsanfrancisco.com/',
              },
              syndicationTrackingProps: {
                thirdPartyLeadsConfig: {
                  categoryAliases: 'cocktailbars,nightlife,pizza,restaurants,sportsbars',
                  city: 'San Francisco',
                  state: 'CA',
                },
              },
            },
          },
          {
            component: 'ServiceUpdateSummary',
            props: {
              title: 'COVID-19 Updates',
              body: {
                text: '"We are open for to-go cocktails, beer, wine, and food, from 11:00 am to 10:00 pm daily.  Call ahead (415-932-6132) or stop by to order.  We also offer delivery."',
                messageLastUpdated: 'Posted on June 13, 2020',
              },
              attributeAvailabilitySections: [
                {
                  title: 'Updated Services',
                  source: null,
                  showSourceIcon: null,
                  attributeAvailabilityList: [
                    {
                      label: 'Delivery',
                      availability: 'AVAILABLE',
                      subtext: null,
                    },
                    {
                      label: 'Takeout',
                      availability: 'AVAILABLE',
                      subtext: null,
                    },
                  ],
                },
              ],
            },
            status: 'render',
          },
          {
            component: 'PhotoGrid',
            props: {
              media: [
                {
                  srcUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/lOPBZqhXrfyJpdsE0tI0dA/348s.jpg',
                  url: '/biz_photos/barrel-proof-san-francisco?select=lOPBZqhXrfyJpdsE0tI0dA',
                  type: 'photo',
                },
                {
                  srcUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/KIoGYyUHRnd_VOAJ8rQL2g/348s.jpg',
                  url: '/biz_photos/barrel-proof-san-francisco?select=KIoGYyUHRnd_VOAJ8rQL2g',
                  type: 'photo',
                },
                {
                  srcUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/tYFvxMaPCWnBf4I15D-5lA/348s.jpg',
                  url: '/biz_photos/barrel-proof-san-francisco?select=tYFvxMaPCWnBf4I15D-5lA',
                  type: 'photo',
                },
                {
                  srcUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/nrlKePhXc9BkhRtpxwwe_w/348s.jpg',
                  url: '/biz_photos/barrel-proof-san-francisco?select=nrlKePhXc9BkhRtpxwwe_w',
                  type: 'photo',
                },
              ],
              mediaCount: 69,
            },
          },
        ],
      },
      bizId: 'B-yUH6Bc1hxy8teT4wa73A',
      initialRequestId: '0945b0912f82b7c4',
      directionsModalProps: {
        businessName: 'Barrel Proof',
        directionsLink:
          'http://maps.google.com/maps?daddr=2331+Mission+St%2C+San+Francisco%2C+CA%2C+US%2C+94110&amp;saddr=Current+Location',
        mapState: {
          hoods: {},
          markers: [
            {
              key: 'starred_location',
              location: { latitude: 37.7597157, longitude: -122.4188774 },
              icon: {
                regularUri: '',
                activeUri: '',
                name: 'starred',
                size: [24, 32],
                scaledSize: [24, 32],
                anchorOffset: [12, 32],
                regularOrigin: [0, 0],
                activeOrigin: [0, 0],
              },
            },
            {
              key: 'current_location',
              location: null,
              icon: {
                regularUri: '',
                activeUri: '',
                name: 'current_location',
                size: [46, 46],
                scaledSize: [46, 46],
                anchorOffset: [23, 23],
                regularOrigin: [0, 0],
                activeOrigin: [0, 0],
              },
            },
          ],
          serviceAreas: null,
          topBizBounds: null,
          geobox: null,
          center: { latitude: 37.7597157, longitude: -122.4188774 },
          zoom: 15,
          scrollwheelZoom: true,
          zoomControlPosition: 'top_left',
          market: null,
          overlayWidth: null,
          library: 'google',
          moMapPossible: true,
          shouldDrawCheckbox: false,
          maxZoomLevel: null,
          minZoomLevel: null,
          adPinColor: null,
          fitToGeobox: false,
        },
        mapsLibrary: 'google',
        locale: 'en_US',
        bunsenEventData: {
          business_id_encid: 'B-yUH6Bc1hxy8teT4wa73A',
          connection_type: 'map_opened',
        },
      },
      fromThisBizProps: {
        specialtiesText:
          "Private Parties\nLarge spaces available for reservation\n30 TV's, 2 bars, video arcade and free pool. \nKitchen open until 10 pm Sunday- Thursday and 11pm on weekends.\nAsk us about private upstairs rental for your next event.",
        yearEstablished: '2018',
        historyText:
          'Barrel Proof is a cocktail sports bar located in the heart of the mission. With great drinks, delicious food and large floor plan with 30 TVs, 2 pool tables and arcade games.\n\n After 8 months of remodeling and countless inspectors we finally were able to open our doors for service as of February 3, 2018.',
        bioText: null,
        ownerName: null,
        ownerRole: null,
        avatarSrc: null,
        avatarSrcSet: null,
      },
      moreInfoProps: {
        businessName: 'Barrel Proof',
        bizInfo: {
          menu: {
            label: 'Menu',
            linkUrl:
              '/biz_redir?url=http%3A%2F%2Fbarrelproofsf.com%2Fmenu%2F&amp;website_link_type=website&amp;src_bizid=B-yUH6Bc1hxy8teT4wa73A&amp;cachebuster=1621304688&amp;s=9e2567e7a6a2c6655ece392e4943d1bd14e924bfa23453f143f8fa9516bdbe81',
            linkText: 'barrelproofsf.com/menu',
          },
          bizHours: [
            { formattedDate: 'Mon-Tue', formattedTime: '4:00 pm - 10:00 pm' },
            { formattedDate: 'Wed', formattedTime: '4:00 pm - 12:00 am' },
            { formattedDate: 'Thu-Fri', formattedTime: '4:00 pm - 2:00 am' },
            { formattedDate: 'Sat', formattedTime: '2:00 pm - 2:00 am' },
            { formattedDate: 'Sun', formattedTime: '2:00 pm - 10:00 pm' },
          ],
          bizSpecialHours: [],
          bizAttributes: [
            { title: 'Takes Reservations', label: 'Yes' },
            { title: 'Delivery', label: 'Yes' },
            { title: 'Take-out', label: 'Yes' },
            { title: 'Accepts Credit Cards', label: 'Yes' },
            { title: 'Parking', label: 'Street' },
            { title: 'Bike Parking', label: 'Yes' },
            { title: 'Wheelchair Accessible', label: 'Yes' },
            { title: 'Good for Kids', label: 'Yes' },
            { title: 'Good for Groups', label: 'Yes' },
            { title: 'Attire', label: 'Casual' },
            { title: 'Ambience', label: 'Casual' },
            { title: 'Alcohol', label: 'Full Bar' },
            { title: 'Good For Happy Hour', label: 'Yes' },
            { title: 'Best Nights', label: 'Sat' },
            { title: 'Smoking', label: 'No' },
            { title: 'Wi-Fi', label: 'Free' },
            { title: 'Has TV', label: 'Yes' },
            { title: 'Caters', label: 'Yes' },
            { title: 'Has Pool Table', label: 'Yes' },
            { title: 'Gender Neutral Restrooms', label: 'Yes' },
          ],
        },
      },
    },
  },
} as const
