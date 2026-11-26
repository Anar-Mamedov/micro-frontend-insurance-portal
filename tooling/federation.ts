/**
 * Module Federation settings shared by every app in this repo, so the shell and the remotes can
 * never disagree about ports or about which dependencies are singletons.
 */

export const PORTS = {
  shell: 5170,
  policy: 5171,
  claims: 5172,
} as const

export const localOrigin = (port: number): string => `http://localhost:${port}`

/**
 * Dependencies that must exist only once on the page:
 * - two copies of React break hooks ("Invalid hook call") and context;
 * - two routers cannot see each other's location;
 * - two copies of the design system would inject the same CSS twice.
 *
 * `singleton` makes the federation runtime pick one version for every app. Each app's
 * package.json range becomes its `requiredVersion`, and a mismatch is reported in the console.
 */
export const sharedDependencies = {
  react: { singleton: true },
  'react-dom': { singleton: true },
  'react-router': { singleton: true },
  '@mfd/ui': { singleton: true },
}
