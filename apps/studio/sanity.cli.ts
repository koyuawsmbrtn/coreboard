import { sanityConnection } from '@repo/sanity-connection'
import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: sanityConnection.projectId,
    dataset: sanityConnection.dataset
  },
  studioHost: sanityConnection.studioHost,
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
