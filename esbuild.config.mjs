import 'dotenv/config'
import esbuild from 'esbuild'
import process from 'node:process'
import builtins from 'builtin-modules'
import esbuildSvelte from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'
import { copy } from 'esbuild-plugin-copy'
import { glob } from 'glob'
import { promisify } from 'node:util'
import { exec as oldExec } from 'node:child_process'

const exec = promisify(oldExec)

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`

const prod = process.argv[2] === 'production'

const context = await esbuild.context({
  plugins: [
    {
      name: 'obsidian-drawing-rust',
      setup(build) {
        build.onResolve({ filter: /obsidian-drawing-rust/ }, async _args => {
          await exec(`npm run wasm-pack`)
          return {
            watchFiles: await glob('./src-rust/src/**/*'),
            namespace: 'rust',
          }
        })
      },
    },
    esbuildSvelte({
      compilerOptions: { css: true },
      preprocess: sveltePreprocess(),
    }),
    copy({
      resolveFrom: 'cwd',
      assets: [
        {
          from: 'manifest.json',
          to: `${process.env.DEV_VAULT_DIRECTORY}/.obsidian/plugins/obsidian-drawing/manifest.json`,
        },
        {
          from: 'main.js',
          to: `${process.env.DEV_VAULT_DIRECTORY}/.obsidian/plugins/obsidian-drawing/main.js`,
        },
        {
          from: 'styles.css',
          to: `${process.env.DEV_VAULT_DIRECTORY}/.obsidian/plugins/obsidian-drawing/styles.css`,
        },
        {
          from: './src-rust/pkg/*',
          to: `${process.env.DEV_VAULT_DIRECTORY}/.obsidian/plugins/obsidian-drawing/pkg`,
        },
      ],
    }),
  ],
  banner: {
    js: banner,
  },
  entryPoints: ['./src/main.ts'],
  bundle: true,
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
  format: 'cjs',
  target: 'es2018',
  logLevel: 'info',
  sourcemap: prod ? false : 'inline',
  treeShaking: true,
  outfile: 'main.js',
})

if (prod) {
  await context.rebuild()
  process.exit(0)
} else {
  await context.watch()
}
