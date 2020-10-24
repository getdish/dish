import { Auth } from '../Auth'
import { ORIGIN } from '../constants'

export async function reviewAnalyze({
  restaurantId,
  text,
}: {
  text: string
  restaurantId: string
}) {
  const response = await fetch('https://auth.dishapp.com/review/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Auth.jwt,
    },
    body: JSON.stringify({
      restaurant_id: restaurantId,
      text,
    }),
  })
  const res = await response.text()
  return JSON.parse(res)
}

// "{
//   \"sentences\": [
//     {
//       \"sentence\": \"i love the pesto\",
//       \"tags\": [
//         \"Pesto\"
//       ],
//       \"score\": 0.9997081160545349
//     }
//   ],
//   \"tags\": [
//     {
//       \"alternates\": null,
//       \"created_at\": \"2020-05-14T14:59:14.414371+00:00\",
//       \"default_images\": [
//         \"https://dish-images.sfo2.digitaloceanspaces.com/6e468f3b-f715-4e75-bcbe-96f00f86930d\",
//         \"https://dish-images.sfo2.digitaloceanspaces.com/b325c0a4-b7e6-47e1-a0cc-1a3a3c297265\",
//         \"https://dish-images.sfo2.digitaloceanspaces.com/08a0a4b1-9b6f-457c-9196-e9c293073011\",
//         \"https://dish-images.sfo2.digitaloceanspaces.com/12c35aa8-fc1e-469f-bf8d-021cffebb0fc\",
//         \"https://dish-images.sfo2.digitaloceanspaces.com/e836f620-1aff-4abc-88e9-44304790142c\",
//         \"https://dish-images.sfo2.digitaloceanspaces.com/554214dc-6a00-4174-a4e0-298c628a7cfc\",
//         \"https://dish-images.sfo2.digitaloceanspaces.com/83eff53f-19f0-4133-9049-7279d183146d\",
//         \"https://dish-images.sfo2.digitaloceanspaces.com/ae637e95-666a-4191-b6fb-f84c671c5dbd\",
//         \"https://dish-images.sfo2.digitaloceanspaces.com/69add312-fd89-4584-a36f-aec66b3c1056\",
//         \"https://dish-images.sfo2.digitaloceanspaces.com/edf47dab-e3dc-46db-b9d3-e56c38e06398\"
//       ],
//       \"description\": null,
//       \"displayName\": \"Pesto\",
//       \"frequency\": 2,
//       \"icon\": null,
//       \"id\": \"40d9ac07-7cd4-4f1e-be94-59e41e9ce914\",
//       \"is_ambiguous\": true,
//       \"misc\": null,
//       \"name\": \"Pesto\",
//       \"order\": 1413608,
//       \"parentId\": \"3d3d5f68-7176-403e-9835-115cacab1d9d\",
//       \"popularity\": 513,
//       \"rgb\": null,
//       \"type\": \"dish\",
//       \"updated_at\": \"2020-10-12T17:10:57.104892+00:00\"
//     }
//   ]
// }"
