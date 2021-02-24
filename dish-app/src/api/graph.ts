// import { route } from '@dish/api'

// // "apollo-server": "2.21.0",
// // "graphql": "^15.5.0",
// // "apollo-server-cache-redis": "^1.2.3"

// const { RedisCache } = require('apollo-server-cache-redis');
// import { ApolloServer } from 'apollo-server'

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   cache: new RedisCache({
//     host: 'redis-server',
//     // Options are passed through to the Redis client
//   }),
//   dataSources: () => ({
//     moviesAPI: new MoviesAPI(),
//   }),
// });

// export default route(async (req, res) => {
//   const url = `${host}${req.path}`
//   console.log('fetch', url)
//   const martinRes = await fetch(url).then((res) => res.json())

//   console.log('got', url, martinRes)

//   if (martinRes.attribution == null) {
//     res.send({
//       ...martinRes,
//       attribution: '',
//     })
//     return
//   }

//   res.send(martinRes)
// })
