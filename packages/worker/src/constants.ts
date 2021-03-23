export const DEBUG_LEVEL = +(process.env.DISH_DEBUG ?? 0)

if (DEBUG_LEVEL > 0) {
  console.log('DEBUG_LEVEL', DEBUG_LEVEL)
}
