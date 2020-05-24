export type LocationState = {
  href: string;
  pathname: string;
  hash: string;
  search: string;
}

export type RouterAction = 'POP' | 'PUSH' | 'REPLACE'

export type RouterState = {
  location: LocationState;
  action: RouterAction;
}

export type BeforePopStateCallback = (state: any) => boolean

export type Structure = {
  fromJS(jsValue: unknown): unknown;
  getIn(state: unknown, keyPath: Iterable<unknown>): unknown;
  merge<S>(state: S, payload: { [key: string]: unknown }): S;
}

export type InitialRouterStateCreator = (url: string) => RouterState
export type InitialRouterStateCreatorFromStructure = (structure: Structure) => InitialRouterStateCreator
