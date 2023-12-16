export default class HashMap {
  constructor() {
    this.boxes = new Array(256).fill(0).map((e) => new LinkedList());
    this.hashes = new Map();
  }
  addToBox(key, val) {
    let index = this.hashIt(key);
    let box = this.boxes[index];
    if (key === "klmlv")
      console.log(
        "Add to box, before:",
        "key:",
        key,
        "val:",
        val,
        "\nList",
        this.getBox(index),
      );
    if (box.has(key)) {
      box.replaceNode(key, val);
    } else {
      box.addTail(key, val);
    }
    if (key === "klmlv")
      console.log(
        "Add to box, after:",
        "key:",
        key,
        "val:",
        val,
        "\nList",
        this.getBox(index),
      );
  }
  removeFromBox(key) {
    let index = this.hashIt(key);
    let box = this.boxes[index];
    if (key === "klmlv") console.log("REMOVING:", "klmlv");
    box.deleteNode(key);
  }
  getBox(index) {
    const arr = [];
    if (this.boxes[index].head !== null) {
      let cur = this.boxes[index].head;
      while (cur) {
        arr.push(+cur.value);
        cur = cur.next;
      }
    }
    return arr;
  }

  hashIt(str) {
    if (this.hashes.has(str)) return this.hashes.get(str);
    let val = 0;
    for (let char of str) {
      let code = char.charCodeAt(0);
      val += code;
      val *= 17;
      val = val % 256;
    }
    this.hashes.set(str, val);
    return val;
  }
}
class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
    this.lookup = new Map();
  }
  addTail(key, val) {
    const node = new Node(val);
    this.lookup.set(key, node);
    this.length++;
    if (!this.head && !this.tail) {
      this.head = node;
      this.tail = node;
      return node;
    }
    node.prev = this.tail;
    if (node.prev) {
      node.prev.next = node;
    }
    this.tail = node;
    return node;
  }
  addHead(key, val) {
    const node = new Node(val);
    this.lookup.set(key, node);
    this.length++;
    if (!this.head && !this.tail) {
      this.head = node;
      this.tail = node;
      return node;
    }
    node.next = this.head;
    if (node.next) {
      node.next.prev = node;
    }
    this.head = node;
    return node;
  }
  deleteNode(key) {
    const node = this.lookup.has(key) ? this.lookup.get(key) : null;
    if (!node) return false;
    this.length--;
    this.lookup.delete(key);
    if (node === this.head) {
      let next = this.head.next;
      this.head.next = null;
      this.head = next;
      if (this.head) this.head.prev = null;
      if (this.length === 0) {
        this.head = null;
        this.tail = null;
      }
      return true;
    }
    if (node === this.tail) {
      let prev = this.tail.prev;
      this.tail.prev = null;
      this.tail = prev;
      if (this.tail) this.tail.next = null;
      if (this.length === 0) {
        this.head = null;
        this.tail = null;
      }
      return true;
    }
    let prev = node.prev;
    let next = node.next;
    prev.next = next;
    next.prev = prev;
    node.next = null;
    node.prev = null;
    return true;
  }
  replaceNode(key, val) {
    let newNode = new Node(val);
    const node = this.lookup.has(key) ? this.lookup.get(key) : null;
    if (!node) return false;
    node.value = val;
    return node;

    // No need for this, leaving it here for now but replacing the value
    // in the existing node is much more performant.
    // let next = node.next;
    // let prev = node.prev;
    // newNode.next = next;
    // newNode.prev = prev;
    // if (next) next.prev = newNode;
    // else this.tail = newNode;
    // if (prev) prev.next = newNode;
    // else this.head = newNode;
    // this.lookup.set(key, newNode);
    // return newNode;
  }
  has(key) {
    return this.lookup.has(key);
  }
}

class Node {
  constructor(val) {
    this.value = val;
    this.prev = null;
    this.next = null;
  }
}
