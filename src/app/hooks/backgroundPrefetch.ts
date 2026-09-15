import { pageRoutes } from '../../config/site'

export interface ConnectionHint {
  readonly saveData?: boolean
  readonly effectiveType?: string
}

/** Only warm the next scene; never download the whole gallery at startup. */
export function backgroundPrefetchPlan(pathname: string, connection?: ConnectionHint) {
  if (connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType ?? '')) return null
  const scenes = pageRoutes.filter((route) => 'background' in route)
  const index = scenes.findIndex((route) => route.path === pathname)
  const current = scenes[index]
  const next = scenes[index + 1]
  return current && next ? { current: current.background, next: next.background } : null
}
