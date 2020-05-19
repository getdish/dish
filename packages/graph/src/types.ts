import { dish, restaurant, review, tag, user } from './graphql'

export type Restaurant = Omit<restaurant, '__typename'>
export type Tag = Omit<tag, '__typename'>
export type User = Omit<user, '__typename'>
export type Review = Omit<review, '__typename'>
export type Dish = Omit<dish, '__typename'>
