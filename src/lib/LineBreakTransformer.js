export default class LineBreakTransformer {
  constructor() {
    this.chunks = "";
  }

  transform(chunk, controller) {
    this.chunks += chunk;

    const lines = this.chunks.split("\r\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    controller.enqueue(this.chunks);
  }
}
