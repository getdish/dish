import React, { useEffect } from 'react'

import { useOvermind } from './overmind'

const Sidebar = () => {
  const { state, actions } = useOvermind()

  useEffect(() => {
    actions.getStats()
  }, [])

  setInterval(() => {
    actions.getStats()
  }, 5000)

  const renderRestaurant = () => {
    const restaurant = state.restaurants[state.selected]
    const dishes = state.dishes[state.selected]
    return (
      <>
        <h3 id="restaurant-details">{restaurant.name}</h3>
        <img width="100%" src={restaurant.image} />
        <h3>Dishes ({dishes.length})</h3>
        <ul>
          {dishes.map(dish => {
            return (
              <li>
                {dish.image ? <img width="30px" src={dish.image} alt="" /> : ''}
                {dish.name}: ${dish.price / 100}
              </li>
            )
          })}
        </ul>
      </>
    )
  }

  return (
    <div id="sidebar">
      <h2>Labs</h2>
      <h3>Crawler Status</h3>
      <ul>
        <li>Total restaurants in DB: {state.stats.restaurant_count}</li>
        <li>Total dishes in DB: {state.stats.dish_count}</li>
        <li>
          Restaurants currently rendered:{' '}
          {Object.keys(state.restaurants).length.toString()}
        </li>
      </ul>
      {state.selected != ''
        ? renderRestaurant()
        : 'Click restaurant to see details'}
    </div>
  )
}

export default Sidebar
