import util from 'util'
import React, { useEffect, useState } from 'react'

import { useOvermind } from './overmind'

const Sidebar = () => {
  const { state, actions } = useOvermind()
  const [showDishes, setShowDishes] = useState(false)
  const [showScrape, setShowScrape] = useState(false)

  useEffect(() => {
    startWatchingStats()
  }, [])

  const startWatchingStats = () => {
    setInterval(() => {
      actions.getStats()
    }, 1000)
  }

  const renderRestaurant = () => {
    const restaurant = state.selected.model
    const scrape = state.selected.scrape
    if (!restaurant.name) {
      return
    }
    return (
      <>
        <h3 id="restaurant-details">{restaurant.name}</h3>
        <img width="100%" src={restaurant.image} />
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
          <button onClick={() => setShowScrape(!showScrape)}>
            Scraped Data ({roughSizeOfObject(scrape)}k)
          </button>
          {showScrape && <pre>{util.inspect(scrape, { depth: Infinity })}</pre>}
        </div>
      </>
    )
  }

  return (
    <div id="sidebar">
      <h2>Labs</h2>
      <h3>Crawler Status</h3>
      <ul>
        <li>Restaurants: {state.stats.restaurant_count}</li>
        <li>Dishes: {state.stats.dish_count}</li>
        <li>Scrapes: {state.stats.scrape_count}</li>
        <li>
          Restaurants currently rendered:{' '}
          {Object.keys(state.restaurants).length.toString()}
        </li>
      </ul>
      {state.selected.id != ''
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
