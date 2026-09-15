/** Resolve a public asset for both root and sub-directory deployments. */
export function assetUrl(relativePath: string, base = import.meta.env.BASE_URL): string {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  return normalizedBase + relativePath.replace(/^\/+/, '')
}
