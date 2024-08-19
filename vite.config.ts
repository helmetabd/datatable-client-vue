import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import typescript2 from 'rollup-plugin-typescript2'
import { resolve } from "path";
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    typescript2({
      check: false,
      include: ['src/components/*.vue'],
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: true,
          declaration: true,
          declarationMap: true
        },
        exclude: ['vite.config.ts', 'main.ts']
      }
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/**/*', // This will include all files and folders within src/assets
          dest: 'assets' // This specifies the destination folder in dist
        }
      ]
    })
  ],
  build: {
    cssCodeSplit: true,
    lib: {
      entry: './src/datatable.ts',
      formats: ['es', 'cjs'],
      name: 'DatatableClient',
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs')
    },
    rollupOptions: {
      external: ['vue', 'bootstrap'],
      output: {
        globals: {
          vue: 'Vue',
          bootstrap: 'bootstrap'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~@': '/src/'
    }
  }
})
