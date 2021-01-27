# use-store

TODO

- usePortal


Better selectors/reactions:

- useSelector
- reaction

Basically make them not tied to one store:

```tsx
const isValid = useStoreSelector(() => {
  return mapStore.isActive && homeStore.isActive
})
```

Same with reaction:

```tsx
useEffect(() => {
  return reaction(
    () => {
      return homeStore.isActive && mapStore.isActive
    },
    isValid => {
      // ...
    }
  )
}, [])
```
