/**
 * Emergency Dashboard — Pexip Web App 3 Plugin
 *
 * This module runs inside a sandboxed iframe loaded by Web App 3.
 * It uses @pexip/plugin-api to register capabilities and interact with the
 * WA3 host application (buttons, panels, call events, etc.).
 *
 * Development:
 *   cd pexip-plugin && npm install && npm run dev
 *   → served at http://localhost:5000
 *   → set this URL as the plugin URL in WA3 admin → Web App settings → Plugins
 *
 * Build for production:
 *   npm run build
 *   → output in pexip-plugin/dist/; host on any HTTPS web server
 */

import { createPlugin } from '@pexip/plugin-api'
import { PLUGIN_CONFIG } from './config'

const run = async (): Promise<void> => {
  // Register this plugin with the Web App 3 host.
  // The version must match PLUGIN_CONFIG.pluginApiVersion and the value
  // displayed in WA3 → About Pexip → "Plugin API Version".
  const plugin = await createPlugin({
    id: PLUGIN_CONFIG.id,
    version: PLUGIN_CONFIG.pluginApiVersion,
  })

  console.log(`[${PLUGIN_CONFIG.displayName}] Plugin registered with Web App 3`)

  // ── Example: add a button to the in-call toolbar ───────────────────────────
  // Uncomment and customise once WA3 loads the plugin successfully.
  //
  // await plugin.ui.addButton({
  //   position: { path: 'toolbar' },
  //   label: PLUGIN_CONFIG.displayName,
  //   icon: {
  //     custom: {
  //       type: 'image/svg+xml',
  //       data: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
  //     },
  //   },
  //   onClick: async () => {
  //     console.log(`[${PLUGIN_CONFIG.displayName}] Toolbar button clicked`)
  //     // e.g. open a side panel, post a message, etc.
  //   },
  // })

  // ── Example: react to call lifecycle events ────────────────────────────────
  //
  // plugin.conference.onCallConnected.add(() => {
  //   console.log(`[${PLUGIN_CONFIG.displayName}] Call connected`)
  // })
  //
  // plugin.conference.onCallDisconnected.add(() => {
  //   console.log(`[${PLUGIN_CONFIG.displayName}] Call disconnected`)
  // })
}

run().catch(console.error)
