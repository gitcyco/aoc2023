import run from "aocrunner";
import HashMap from "./LinkedList.js";

const parseInput = (rawInput) => rawInput;

function hashIt(str) {
  let val = 0;
  for (let char of str) {
    let code = char.charCodeAt(0);
    val += code;
    val *= 17;
    val = val % 256;
  }
  return val;
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const items = input.split(",");
  let sum = 0;
  for (let item of items) {
    sum += hashIt(item);
  }
  // console.log(sum);
  return sum;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const items = input.split(",");
  // console.log("items:", items.length);
  const instructions = items.map((ins) => {
    if (ins.includes("=")) {
      let [label, focal] = ins.split("=");
      let hash = hashIt(label);
      return { label, focal, hash, type: "=" };
    } else {
      let [label] = ins.split("-");
      let hash = hashIt(label);
      return { label, hash, type: "-" };
    }
  });
  // console.log(instructions);
  const boxes = new HashMap();
  for (let ins of instructions) {
    if (ins.type === "=") {
      boxes.addToBox(ins.label, ins.focal);
    } else if (ins.type === "-") {
      boxes.removeFromBox(ins.label);
    }
  }
  let sum = 0;
  for (let i = 0; i < 256; i++) {
    let box = boxes.getBox(i);
    if (box.length > 0) {
      for (let slot = 0; slot < box.length; slot++) {
        let res = i + 1;
        res *= slot + 1;
        res *= box[slot];
        sum += res;
      }
    }
  }
  console.log(sum);
  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 1320,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 145,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
