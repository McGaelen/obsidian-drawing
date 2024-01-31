// noinspection JSUnusedGlobalSymbols
import { type MarkdownPostProcessorContext, Plugin, type TFile } from 'obsidian'
import DrawingPlugin from './components/DrawingPlugin.svelte'

// interface MyPluginSettings {
//   mySetting: string
// }

// const DEFAULT_SETTINGS: MyPluginSettings = {
//   mySetting: 'default',
// }

export default class HelloWorldPlugin extends Plugin {
  // settings: MyPluginSettings
  svelteRoot: DrawingPlugin

  async onload() {
    // await this.loadSettings()

    // This adds a settings tab so the user can configure various aspects of the plugin
    // this.addSettingTab(new SampleSettingTab(this.app, this))

    this.registerMarkdownCodeBlockProcessor(
      'drawing',
      this.drawingBlockProcessor.bind(this),
    )
  }

  async drawingBlockProcessor(
    filepath: string,
    el: HTMLElement,
    ctx: MarkdownPostProcessorContext,
  ) {
    console.log('RUNNING!!! ITS GONNA SCROLL!!!!!!!!', this)

    const svgFile: TFile | null =
      app.vault.getFiles().find(file => file.path === filepath.trim()) ?? null
    if (!svgFile) return

    const source = await app.vault.cachedRead(svgFile)
    if (this.svelteRoot) this.svelteRoot.$destroy()

    this.svelteRoot = new DrawingPlugin({
      target: el,
      props: { source },
    })
    this.svelteRoot.$on('save', async ({ detail }) => {
      await this.app.vault.process(svgFile, _ => detail)
    })
  }

  // async loadSettings() {
  //   this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  // }

  // async saveSettings() {
  //   await this.saveData(this.settings)
  // }
}
