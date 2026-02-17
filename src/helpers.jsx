export { handleKeyPress, Path, helpText, findLangFromFile };

const handleKeyPress = (eventKeystring, keysHmap) => {
  const action = keysHmap[eventKeystring];
  if (action) {
    action();
    return true;
  }
  return false;
};

class Path {
  #items;
  constructor() {
    this.#items = [];
  }
  push = (element) => this.#items.push(element);
  pop = () => this.#items.pop() || null;
  peek = () => this.#items[this.#items.length - 1] || null;
  isEmpty = () => this.#items.length === 0;
}

const helpText = (
  <div style={{ padding: "1rem", color: "#757575" }}>
    <p> Control + E: Open File Explorer</p>
    <p> Control + S: Save Current File (Not Implemented)</p>
    <p> Control + J: Open Terminal in Current Directory</p>
    <p> Control + H: Open This Help Modal</p>
    <p> Control + Q: Quit Application</p>
    <p> Control + W: Close Current File (Not Implemented)</p>
    <p> Escape: Close Modals / Clear Status Messages</p>
  </div>
);

// just added this code in its own source file from my new code editor lol


function findLangFromFile(fileName = "") {
  const ext = fileName.split(".").pop().toLowerCase();
  return {
    js: "javascript", jsx: "jsx", ts: "typescript", tsx: "tsx",
    py: "python", rs: "rust", rb: "ruby", java: "java",
    c: "c", cpp: "cpp", h: "c", cs: "csharp", go: "go",
    php: "php", html: "markup", htm: "markup", css: "css",
    json: "json", md: "markdown", sh: "bash", yml: "yaml",
    yaml: "yaml"
  }[ext] || "javascript";
}