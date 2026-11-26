/**
 * The contract between the shell and every remote app. A remote's exposed component receives
 * exactly these props; anything else it needs it fetches from its own API. Keeping this small is
 * what keeps the micro-frontends loosely coupled.
 */
export type CurrentUser = {
  name: string
  role: 'agent' | 'admin'
}

export type RemoteAppProps = {
  /** Provided by the shell, which owns authentication. Remotes never handle tokens themselves. */
  user: CurrentUser
}
