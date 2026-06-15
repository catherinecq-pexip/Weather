/**
 * Plugin configuration.
 *
 * pluginApiVersion:
 *   Open Web App 3 → click your avatar → About Pexip.
 *   The "Plugin API Version" shown there is the value to set here.
 *   It must match the protocol version supported by the running WA3 instance.
 *
 * npmPackageVersion:
 *   The @pexip/plugin-api npm package version in package.json should also be
 *   compatible with the WA3 Plugin API Version. Check the Pexip developer
 *   portal for the mapping table:
 *   https://developer.pexip.com/docs/plugins
 */
export const PLUGIN_CONFIG = {
  /** Unique identifier for this plugin — must not collide with other plugins */
  id: 'emergency-dashboard-plugin',

  /**
   * Plugin API version — update this to match the value shown in
   * Web App 3 → About Pexip → "Plugin API Version".
   */
  pluginApiVersion: '1',

  /** Display name shown in WA3 error messages and developer tools */
  displayName: 'Emergency Dashboard',

  /** Target conference details (mirrors the dashboard app's config) */
  meeting: {
    node: 'conifer01.az.sunsikker.com',
    alias: 'east@az.sunsikker.com',
  },
} as const
