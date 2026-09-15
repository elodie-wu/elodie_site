import type { AnchorHTMLAttributes } from 'react'

/** External links consistently open a safe new tab. */
export function ExternalLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} target="_blank" rel="noopener noreferrer" />
}
