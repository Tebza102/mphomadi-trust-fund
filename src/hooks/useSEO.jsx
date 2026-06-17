import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Mpho Madi Trust Fund'
const DEFAULT_OG_IMAGE = '/images/og-default.jpg'

/**
 * Drop this into any page component to set <head> meta.
 * All props are optional — sensible defaults apply.
 *
 * @param {object} props
 * @param {string} [props.title]       Page-level title (SITE_NAME is appended automatically)
 * @param {string} [props.description] Meta description
 * @param {string} [props.ogImage]     Absolute URL to OG image (falls back to DEFAULT_OG_IMAGE)
 * @param {string} [props.ogUrl]       Canonical URL for this page
 */
export function useSEO({ title, description, ogImage, ogUrl } = {}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const resolvedImage = ogImage || DEFAULT_OG_IMAGE

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={resolvedImage} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={resolvedImage} />
    </Helmet>
  )
}
