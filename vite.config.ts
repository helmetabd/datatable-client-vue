import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import dts from 'vite-plugin-dts'
import typescript2 from 'rollup-plugin-typescript2'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    typescript2({
      check: false,
      include: ['src/components/*.vue', 'src/**/*.ts'], // Also include TS files
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: true,
          declaration: true,
          declarationMap: true
        },
        exclude: ['vite.config.ts', 'main.ts']
      }
    })
    // dts({
    //   include: ['src/**/*.ts', 'src/**/*.vue'], // Include TS and Vue files
    //   rollupTypes: true // Roll up all .d.ts files into a single file
    // })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/datatable.ts'),
      formats: ['es', 'cjs', 'umd'],
      name: 'DatatableClient',
      fileName: `datatable-client`
    },
    rollupOptions: {
      external: ['vue', 'bootstrap'],
      output: {
        exports: 'named',
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
