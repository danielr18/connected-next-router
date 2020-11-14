##Migrate from `connected-react-ruter`
`connected-next-router` provides the same expected behavior as with `connected-react-ruter` but with has the following caveats:
1. Currently `connected-next-router` does not include any of the selectors in `connected-react-ruter` like `getLocation`, `getAction`, `getHash`, `getSearch`, `createMatchSelector`.
2. Also there is a change in the API with how you use the actions in `connected-react-router` due to different router API in `next/router` as of version `v9.x.x`. From `v10.x.x` you do not need to pass  due to [Automatic href Resolution](https://nextjs.org/blog/next-10#automatic-resolving-of-href).

You might still see your code breaking as `connected-next-router` uses `next/router` which has a different API than `connected-react-ruter` or `react-router-redux` so you need to test any of your references to `connected-next-router` before putting anything into production.