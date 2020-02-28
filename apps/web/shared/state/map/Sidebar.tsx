import React, { useEffect, useState } from 'react'
import util from 'util'

import { useOvermind } from '../overmind'

const Sidebar = () => {
  const { state, actions } = useOvermind()
  const [showDishes, setShowDishes] = useState(false)
  const [showYelp, setShowYelp] = useState(false)
  const [showUber, setShowUber] = useState(false)
  const [showPhotos, setShowPhotos] = useState(false)

  useEffect(() => {
    startWatchingStats()
  }, [])

  const startWatchingStats = () => {
    setInterval(() => {
      actions.map.getStats()
    }, 60 * 1000)
  }

  const renderRestaurant = () => {
    const restaurant = state.map.selected.model
    const scrapes = state.map.selected.scrapes
    if (!restaurant.name) {
      return
    }
    return (
      <>
        <h3 id="restaurant-details">{restaurant.name}</h3>
        <img width="100%" src={restaurant.image} />
        <ul>
          <li>
            Categories:{' '}
            {restaurant.categories && restaurant.categories.join(', ')}
          </li>
          <li>Address: {restaurant.address}</li>
          <li>Telephone: {restaurant.telephone}</li>
          <li>Rating: {restaurant.rating}</li>
        </ul>
        <div className="data_section">
          <button onClick={() => setShowDishes(!showDishes)}>
            Dishes ({restaurant.dishes.length})
          </button>
          {showDishes && (
            <ul>
              {restaurant.dishes.map(dish => {
                return (
                  <li>
                    {dish.image ? (
                      <img width="30px" src={dish.image} alt="" />
                    ) : (
                      ''
                    )}
                    {dish.name}: ${dish.price / 100}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
        <div className="data_section">
          <button onClick={() => setShowPhotos(!showPhotos)}>
            Photos ({restaurant.photos ? restaurant.photos.length : 0})
          </button>
          {showPhotos && (
            <div>
              {restaurant.photos &&
                restaurant.photos.map(src => {
                  return <img width="200px" src={src} alt="" />
                })}
            </div>
          )}
        </div>
        <div className="data_section">
          <button onClick={() => setShowYelp(!showYelp)}>
            Yelp Scrape ({roughSizeOfObject(scrapes.yelp)}k)
          </button>
          {showYelp && (
            <pre>{util.inspect(scrapes.yelp, { depth: Infinity })}</pre>
          )}
        </div>
        <div className="data_section">
          <button onClick={() => setShowUber(!showUber)}>
            UberEats Scrape ({roughSizeOfObject(scrapes.ubereats)}k)
          </button>
          {showUber && (
            <pre>{util.inspect(scrapes.ubereats, { depth: Infinity })}</pre>
          )}
        </div>
      </>
    )
  }

  return (
    <div id="sidebar">
      <h2>Labs</h2>
      <h3>Crawler Status</h3>
      <ul>
        <li>Restaurants: {state.map.stats.restaurant_count}</li>
        <li>Dishes: {state.map.stats.dish_count}</li>
        <li>Scrapes: {state.map.stats.scrape_count}</li>
        <li>
          Restaurants currently rendered:{' '}
          {Object.keys(state.map.restaurants).length.toString()}
        </li>
      </ul>
      {state.map.selected.id != ''
        ? renderRestaurant()
        : 'Click restaurant to see details'}
    </div>
  )
}

function roughSizeOfObject(object: {}) {
  var objectList = []
  var stack = [object]
  var bytes = 0

  while (stack.length) {
    var value = stack.pop()

    if (typeof value === 'boolean') {
      bytes += 4
    } else if (typeof value === 'string') {
      bytes += value.length * 2
    } else if (typeof value === 'number') {
      bytes += 8
    } else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
      objectList.push(value)

      for (var i in value) {
        stack.push(value[i])
      }
    }
  }
  return Math.round((bytes / 1024) * 100) / 100
}

export default Sidebar
