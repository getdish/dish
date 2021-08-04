import { list, order_by } from '@dish/graph'

export const getListPhoto = (list?: list | null) => {
  return (
    list?.restaurants({
      where: {
        restaurant: {
          image: {
            _is_null: false,
          },
        },
      },
      order_by: [{ position: order_by.asc }],
      limit: 1,
    })[0]?.restaurant?.image ?? ''
  )
}
