/** Resolve public assets against the document, never the consuming CSS file. */
export function assetUrl(
  relativePath: string,
  base = import.meta.env.BASE_URL,
  documentBaseUrl = typeof document === 'undefined' ? undefined : document.baseURI,
): string {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  const path = normalizedBase + relativePath.replace(/^\/+/, '')
  // CSS variables containing relative url(...) resolve at the stylesheet location.
  // Fully qualified URLs also work for nested Pages sites and hash routes.
  return documentBaseUrl ? new URL(path, documentBaseUrl).href : path
}
