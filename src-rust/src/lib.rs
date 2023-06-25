mod utils;

use wasm_bindgen::prelude::*;
use web_sys::{Document, Window, HtmlCanvasElement, HtmlDivElement};

#[wasm_bindgen]
extern {
  fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
  // Hello there
  println!("hello world!!");
  alert("Hello, NEW MESSAGE!!!!!!!!!!!! from obsidian-drawing-rust!");
}

#[wasm_bindgen]
pub fn init_canvas(canvas: HtmlCanvasElement) {
  utils::set_panic_hook();

  let document = web_sys::window().expect("couldn't get window").document().expect("couldn't get document");

  let p = document.create_element("p").expect("failed to create p element");
  p.set_text_content(Some("my paragraph"));

  web_sys::console::log_1(&p);

  document.body().expect("failed to get body").append_child(&p).expect("failed to append child");

  web_sys::console::log_1(&canvas);

}

#[wasm_bindgen]
pub fn init_p(div: HtmlDivElement) {
  div.set_text_content(Some("Hello there from Wasm!"));
}