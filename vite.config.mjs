import 'dotenv/config'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import builtins from 'builtin-modules'
import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'node:fs'

const prod = !!process.env.PRODUCTION
if (prod) {
  console.log('Using production build settings')
}

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    tailwindcss(),
    {
      name: 'copy-to-obsidian-vault',
      apply: 'build',
      // Use closeBundle hook to ensure outfiles are written to disk before running
      closeBundle(error) {
        // do nothing if the build had an error
        if (error) return

        if (!process.env.DEV_VAULT_DIRECTORY) {
          throw new Error('DEV_VAULT_DIRECTORY is not defined!')
        }

        copyFileSync(
          resolve(__dirname, 'manifest.json'),
          `${process.env.DEV_VAULT_DIRECTORY}/.obsidian/plugins/obsidian-drawing/manifest.json`,
        )
        copyFileSync(
          resolve(__dirname, 'dist/main.js'),
          `${process.env.DEV_VAULT_DIRECTORY}/.obsidian/plugins/obsidian-drawing/main.js`,
        )
        copyFileSync(
          resolve(__dirname, 'dist/styles.css'),
          `${process.env.DEV_VAULT_DIRECTORY}/.obsidian/plugins/obsidian-drawing/styles.css`,
        )
      },
    },
  ],
  // resolve: {
  //   alias: {
  //     $lib: resolve(__dirname, 'src/lib'),
  //   },
  // },
  build: {
    // Using Vite in library mode https://vite.dev/guide/build.html#library-mode
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      formats: ['cjs'],
      fileName: 'main',
      cssFileName: 'styles',
    },
    outDir: 'dist',
    watch: {
      include: ['src/**/*'],
    },
    rollupOptions: {
      external: [
        'obsidian',
        'electron',
        '@codemirror/autocomplete',
        '@codemirror/collab',
        '@codemirror/commands',
        '@codemirror/language',
        '@codemirror/lint',
        '@codemirror/search',
        '@codemirror/state',
        '@codemirror/view',
        '@lezer/common',
        '@lezer/highlight',
        '@lezer/lr',
        ...builtins,
      ],
      treeshake: true,
    },
    target: 'es2018',
    sourcemap: prod ? false : 'inline',
    minify: prod,
  },
})
