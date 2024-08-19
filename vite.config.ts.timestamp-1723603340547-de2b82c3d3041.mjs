// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///D:/learn%20typescript/project/datatable-client-vue/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/learn%20typescript/project/datatable-client-vue/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueDevTools from "file:///D:/learn%20typescript/project/datatable-client-vue/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import typescript2 from "file:///D:/learn%20typescript/project/datatable-client-vue/node_modules/rollup-plugin-typescript2/dist/rollup-plugin-typescript2.cjs.js";
import { viteStaticCopy } from "file:///D:/learn%20typescript/project/datatable-client-vue/node_modules/vite-plugin-static-copy/dist/index.js";
var __vite_injected_original_import_meta_url = "file:///D:/learn%20typescript/project/datatable-client-vue/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    typescript2({
      check: false,
      include: ["src/components/*.vue"],
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: true,
          declaration: true,
          declarationMap: true
        },
        exclude: ["vite.config.ts", "main.ts"]
      }
    }),
    viteStaticCopy({
      targets: [
        {
          src: "src/assets/**/*",
          // This will include all files and folders within src/assets
          dest: "assets"
          // This specifies the destination folder in dist
        }
      ]
    })
  ],
  build: {
    cssCodeSplit: false,
    lib: {
      entry: "./src/datatable.ts",
      formats: ["es", "cjs"],
      name: "DatatableClient",
      fileName: (format) => format === "es" ? "index.js" : "index.cjs"
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue"
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
      "~@": "/src/"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxsZWFybiB0eXBlc2NyaXB0XFxcXHByb2plY3RcXFxcZGF0YXRhYmxlLWNsaWVudC12dWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGxlYXJuIHR5cGVzY3JpcHRcXFxccHJvamVjdFxcXFxkYXRhdGFibGUtY2xpZW50LXZ1ZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovbGVhcm4lMjB0eXBlc2NyaXB0L3Byb2plY3QvZGF0YXRhYmxlLWNsaWVudC12dWUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHZ1ZURldlRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scydcbmltcG9ydCB0eXBlc2NyaXB0MiBmcm9tICdyb2xsdXAtcGx1Z2luLXR5cGVzY3JpcHQyJ1xuaW1wb3J0IHsgdml0ZVN0YXRpY0NvcHkgfSBmcm9tICd2aXRlLXBsdWdpbi1zdGF0aWMtY29weSdcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICB2dWVEZXZUb29scygpLFxuICAgIHR5cGVzY3JpcHQyKHtcbiAgICAgIGNoZWNrOiBmYWxzZSxcbiAgICAgIGluY2x1ZGU6IFsnc3JjL2NvbXBvbmVudHMvKi52dWUnXSxcbiAgICAgIHRzY29uZmlnT3ZlcnJpZGU6IHtcbiAgICAgICAgY29tcGlsZXJPcHRpb25zOiB7XG4gICAgICAgICAgc291cmNlTWFwOiB0cnVlLFxuICAgICAgICAgIGRlY2xhcmF0aW9uOiB0cnVlLFxuICAgICAgICAgIGRlY2xhcmF0aW9uTWFwOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIGV4Y2x1ZGU6IFsndml0ZS5jb25maWcudHMnLCAnbWFpbi50cyddXG4gICAgICB9XG4gICAgfSksXG4gICAgdml0ZVN0YXRpY0NvcHkoe1xuICAgICAgdGFyZ2V0czogW1xuICAgICAgICB7XG4gICAgICAgICAgc3JjOiAnc3JjL2Fzc2V0cy8qKi8qJywgLy8gVGhpcyB3aWxsIGluY2x1ZGUgYWxsIGZpbGVzIGFuZCBmb2xkZXJzIHdpdGhpbiBzcmMvYXNzZXRzXG4gICAgICAgICAgZGVzdDogJ2Fzc2V0cycgLy8gVGhpcyBzcGVjaWZpZXMgdGhlIGRlc3RpbmF0aW9uIGZvbGRlciBpbiBkaXN0XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9KVxuICBdLFxuICBidWlsZDoge1xuICAgIGNzc0NvZGVTcGxpdDogZmFsc2UsXG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogJy4vc3JjL2RhdGF0YWJsZS50cycsXG4gICAgICBmb3JtYXRzOiBbJ2VzJywgJ2NqcyddLFxuICAgICAgbmFtZTogJ0RhdGF0YWJsZUNsaWVudCcsXG4gICAgICBmaWxlTmFtZTogKGZvcm1hdCkgPT4gKGZvcm1hdCA9PT0gJ2VzJyA/ICdpbmRleC5qcycgOiAnaW5kZXguY2pzJylcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBbJ3Z1ZSddLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICB2dWU6ICdWdWUnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAnfkAnOiAnL3NyYy8nXG4gICAgfVxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0VSxTQUFTLGVBQWUsV0FBVztBQUUvVyxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxpQkFBaUI7QUFDeEIsU0FBUyxzQkFBc0I7QUFOZ0wsSUFBTSwyQ0FBMkM7QUFTaFEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osWUFBWTtBQUFBLElBQ1osWUFBWTtBQUFBLE1BQ1YsT0FBTztBQUFBLE1BQ1AsU0FBUyxDQUFDLHNCQUFzQjtBQUFBLE1BQ2hDLGtCQUFrQjtBQUFBLFFBQ2hCLGlCQUFpQjtBQUFBLFVBQ2YsV0FBVztBQUFBLFVBQ1gsYUFBYTtBQUFBLFVBQ2IsZ0JBQWdCO0FBQUEsUUFDbEI7QUFBQSxRQUNBLFNBQVMsQ0FBQyxrQkFBa0IsU0FBUztBQUFBLE1BQ3ZDO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxlQUFlO0FBQUEsTUFDYixTQUFTO0FBQUEsUUFDUDtBQUFBLFVBQ0UsS0FBSztBQUFBO0FBQUEsVUFDTCxNQUFNO0FBQUE7QUFBQSxRQUNSO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGNBQWM7QUFBQSxJQUNkLEtBQUs7QUFBQSxNQUNILE9BQU87QUFBQSxNQUNQLFNBQVMsQ0FBQyxNQUFNLEtBQUs7QUFBQSxNQUNyQixNQUFNO0FBQUEsTUFDTixVQUFVLENBQUMsV0FBWSxXQUFXLE9BQU8sYUFBYTtBQUFBLElBQ3hEO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsS0FBSztBQUFBLE1BQ2hCLFFBQVE7QUFBQSxRQUNOLFNBQVM7QUFBQSxVQUNQLEtBQUs7QUFBQSxRQUNQO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLE1BQ3BELE1BQU07QUFBQSxJQUNSO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
