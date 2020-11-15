## Migrate from `connected-react-router`
`connected-next-router` provides the same expected behavior as  `connected-react-router` but it has the following caveats:

1. `connected-next-router` does not include any of the selectors in `connected-react-router` like `getLocation`, `getAction`, `getHash`, `getSearch`, `createMatchSelector`.
2. There is a change in the API with how you use the actions in `connected-react-router` due to the need of specifying `href` and `as` for dynamic routes before Next.js `v10.x.x`. From `v10.x.x` you do not need to pass `as` due to [Automatic href Resolution](https://nextjs.org/blog/next-10#automatic-resolving-of-href).
3. The history action is not stored in the Redux state.

You might still see your code breaking as `connected-next-router` uses `next/router` which has a different API than `connected-react-router` or `react-router-redux`, so you need to test any of your references to `connected-next-router` before putting anything into production.