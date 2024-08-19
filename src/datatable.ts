import type { App } from 'vue'
import { DatatableClient } from './components'

export default {
  install: (app: App, options: { asset_url: string } = { asset_url: null }) => {
    app.component('DatatableClient', DatatableClient)
    app.provide('asset_url', options.asset_url)
  }
}

export { DatatableClient }
