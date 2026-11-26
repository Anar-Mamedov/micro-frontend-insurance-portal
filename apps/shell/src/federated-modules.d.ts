/**
 * Types for the modules the remotes expose. They are not resolved at build time (the federation
 * runtime fetches them from remoteEntry.js), so TypeScript learns their shape from the contract
 * package instead.
 */
declare module 'policy/PolicyApp' {
  import type { RemoteAppProps } from '@mfd/contracts'
  import type { ComponentType } from 'react'

  const PolicyApp: ComponentType<RemoteAppProps>
  export default PolicyApp
}

declare module 'claims/ClaimsApp' {
  import type { RemoteAppProps } from '@mfd/contracts'
  import type { ComponentType } from 'react'

  const ClaimsApp: ComponentType<RemoteAppProps>
  export default ClaimsApp
}
