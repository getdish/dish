import { t_restaurant, t_review, t_tag, t_user } from '../src/graphql'

// helper types for gqless

export type Restaurant = t_restaurant['data']
export type Tag = t_tag['data']
export type User = t_user['data']
export type Review = t_review['data']
