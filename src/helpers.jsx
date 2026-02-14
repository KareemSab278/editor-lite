export {handleKeyPress, Path, helpText};

const handleKeyPress = (eventKeystring, keysHmap) => {
    const action = keysHmap[eventKeystring];
    if (action) {
        action();
        return true;
    }
    return false;
}

class Path {
  #items;
  constructor() {
    this.#items = [];
  }
  push(element) {
    this.#items.push(element);
  }
  pop() {
    return this.#items.pop() || null;
  }
  peek() {
    return this.#items[this.#items.length - 1] || null;
  }
  isEmpty() {
    return this.#items.length === 0;
  }
  size() {
    return this.#items.length;
  }
}

const helpText = ( 
  <div style={{ padding: "1rem", color: "#757575" }}>
    <p> Control + E: Open File Explorer</p>
    <p> Control + S: Save Current File (Not Implemented)</p>
    <p> Control + J: Open Terminal in Current Directory</p>
    <p> Control + H: Open This Help Modal</p>
    <p> Control + Q: Quit Application</p>
    <p> Escape: Close Modals / Clear Status Messages</p>
  </div>
);

// just added this code in its own source file from my new code editor lol