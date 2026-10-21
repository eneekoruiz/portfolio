/// <reference lib="webworker" />
import { createSandRenderer, type SandMessage, type SandRenderer } from "../lib/sand-renderer";

// The sand shader runs on its own thread: shader compilation, uniform uploads
// and draw calls never compete with scrolling, GSAP or React on the main thread.
let renderer: SandRenderer | null = null;

self.onmessage = (event: MessageEvent<SandMessage>) => {
  const message = event.data;
  if (message.type === "init") {
    renderer = createSandRenderer(message.canvas);
    self.postMessage({ type: renderer ? "ready" : "unsupported" });
    return;
  }
  if (!renderer) return;
  switch (message.type) {
    case "resize":
      renderer.resize(message.width, message.height);
      break;
    case "theme":
      renderer.theme(message.theme);
      break;
    case "impact":
      renderer.impact(message.x, message.y, message.amplitude);
      break;
    case "crack":
      renderer.crack(message.crack);
      break;
    case "state":
      renderer.state(message.enabled, message.visible);
      break;
    case "dispose":
      renderer.dispose();
      renderer = null;
      self.close();
      break;
  }
};
