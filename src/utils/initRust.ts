import init from 'obsidian-drawing-rust'
import wasm from 'obsidian-drawing-rust/obsidian_drawing_rust_bg.wasm'

export async function initRust() {
  await init(wasm)
}
