2021-04-07T18:53:00.250Z b8db66e9 lax [info] Processing job (22428, attempt: 1): GrubHub.getRestaurant(["2285758"])
2021-04-07T18:53:00.263Z b8db66e9 lax [info]   {
2021-04-07T18:53:00.263Z b8db66e9 lax [info]  [gqless] errors [
2021-04-07T18:53:00.264Z b8db66e9 lax [info]     "extensions": {
2021-04-07T18:53:00.265Z b8db66e9 lax [info]       "path": "$.selectionSet.insert_restaurant.args.objects",
2021-04-07T18:53:00.266Z b8db66e9 lax [info]     },
2021-04-07T18:53:00.266Z b8db66e9 lax [info]       "code": "constraint-violation"
2021-04-07T18:53:00.269Z b8db66e9 lax [info] ]
2021-04-07T18:53:00.269Z b8db66e9 lax [info]   }
2021-04-07T18:53:00.269Z b8db66e9 lax [info]     "message": "Uniqueness violation. duplicate key value violates unique constraint \"restaurant_name_address_key\""
2021-04-07T18:53:00.278Z b8db66e9 lax [info] Error: Uniqueness violation. duplicate key value violates unique constraint "restaurant_name_address_key" (sentry)
