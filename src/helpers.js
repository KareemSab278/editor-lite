export {handleKeyPress, Path};

const handleKeyPress = (eventKeystring, keysHmap) => {
    const action = keysHmap[eventKeystring];
    if (action) {
        action();
        return true;
    }
    return false;
}

class Path { // implemented a stack data structure to keep track of the path history for the file explorer modal.
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