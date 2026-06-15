/** Pexip Infinity conferencing node DNS name */
export const MEETING_NODE = 'conifer01.az.sunsikker.com'

/** Target VMR alias */
export const MEETING_ALIAS = 'east@az.sunsikker.com'

/**
 * Web App 3 branding / deployment path on the node.
 * Pexip allows this to be customised per deployment — change it here if your
 * WA3 is served from a different base path (e.g. '/mycompany' or '/').
 * Default for a standard WA3 installation is '/webapp3'.
 */
export const BRANDING_PATH = '/webapp3'

/**
 * Builds a Pexip Web App 3 direct-join URL.
 *
 * Format: https://{node}{brandingPath}/m/{encodedAlias}
 */
export const buildMeetingUrl = (
  node: string,
  alias: string,
  brandingPath: string = BRANDING_PATH,
): string => `https://${node}${brandingPath}/m/${encodeURIComponent(alias)}`

/** Pre-built URL for the configured meeting */
export const MEETING_URL = buildMeetingUrl(MEETING_NODE, MEETING_ALIAS)
