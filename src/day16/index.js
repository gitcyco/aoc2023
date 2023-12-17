import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  // console.log(input);
  const lines = input.split("\n").map((e) => e.trim());
  // console.log(lines);
  const map = lines.map((e) =>
    e.split("").map((item) => {
      if (item === ".") return new Empty();
      // else if (/\\/.test(item)) return new Mirror("Lmirror");
      else if (item === "\\") return new Mirror("Lmirror");
      else if (item === "/") return new Mirror("Rmirror");
      else if (item === "|") return new Reflector("|");
      else if (item === "-") return new Reflector("-");
      else
        throw new Error(
          `Unknown node type: ${item}, code: ${item.charCodeAt(0)}`,
        );
    }),
  );
  // console.log(map);
  let total = 0;
  const [yLen, xLen] = [map.length, map[0].length];
  const beams = [];
  beams.push(new Beam([0, -1], "E"));

  while (beams.length > 0) {
    const beam = beams.pop();

    beam.move();
    const [curY, curX] = beam.current;
    // If the beam is out of bounds, kill the beam
    if (curY > yLen - 1 || curX > xLen - 1 || curY < 0 || curX < 0) {
      // kill the beam by continuing the while loop
      continue;
    }
    const currentNode = map[curY][curX];
    // If any beam has entered this node from this direction before, kill the beam
    if (currentNode.enteredFrom[beam.from]) {
      // kill the beam by continuing the while loop
      continue;
    } else {
      // otherwise mark that we entered from this direction before
      currentNode.enteredFrom[beam.from] = true;
    }
    if (!currentNode.visited) {
      total++;
      currentNode.visited = true;
    }

    switch (currentNode.type) {
      case "empty":
        beams.push(beam);
        break;
      case "Lmirror":
        beam.changeDir(currentNode.reflect(beam.from));
        beams.push(beam);
        break;
      case "Rmirror":
        beam.changeDir(currentNode.reflect(beam.from));
        beams.push(beam);
        break;
      case "|":
        if (beam.from in currentNode.split) {
          let [dirA, dirB] = currentNode.split[beam.from];
          beam.changeDir(dirA);
          const newBeam = new Beam([curY, curX], dirB);
          beams.push(beam);
          beams.push(newBeam);
        } else {
          beams.push(beam);
        }
        break;
      case "-":
        if (beam.from in currentNode.split) {
          let [dirA, dirB] = currentNode.split[beam.from];
          beam.changeDir(dirA);
          const newBeam = new Beam([curY, curX], dirB);
          beams.push(beam);
          beams.push(newBeam);
        } else {
          beams.push(beam);
        }
        break;
    }

    // console.log(
    //   "beam is currently at:",
    //   beam.current,
    //   "which is:",
    //   map[curY][curX],
    // );
  }
  console.log("number of affected nodes:", total);
  return total;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n").map((e) => e.trim());
  const [yLen, xLen] = [lines.length, lines[0].length];
  let max = -Infinity;

  for (let y = 0; y < yLen; y++) {
    max = Math.max(max, processMap([y, -1], "E", lines));
    max = Math.max(max, processMap([y, xLen], "W", lines));
  }
  for (let x = 1; x < xLen - 1; x++) {
    max = Math.max(max, processMap([-1, x], "S", lines));
    max = Math.max(max, processMap([yLen, x], "N", lines));
  }

  console.log("part 2 output:", max);
  return max;
};

function processMap(start, startDir, lines) {
  // const input = parseInput(rawInput);
  // console.log(input);
  // const lines = input.split("\n").map((e) => e.trim());
  // console.log(lines);
  const map = lines.map((e) =>
    e.split("").map((item) => {
      if (item === ".") return new Empty();
      // else if (/\\/.test(item)) return new Mirror("Lmirror");
      else if (item === "\\") return new Mirror("Lmirror");
      else if (item === "/") return new Mirror("Rmirror");
      else if (item === "|") return new Reflector("|");
      else if (item === "-") return new Reflector("-");
      else
        throw new Error(
          `Unknown node type: ${item}, code: ${item.charCodeAt(0)}`,
        );
    }),
  );
  // console.log(map);
  let total = 0;
  const [yLen, xLen] = [map.length, map[0].length];
  const beams = [];
  beams.push(new Beam(start, startDir));

  while (beams.length > 0) {
    const beam = beams.pop();

    beam.move();
    const [curY, curX] = beam.current;
    // If the beam is out of bounds, kill the beam
    if (curY > yLen - 1 || curX > xLen - 1 || curY < 0 || curX < 0) {
      // kill the beam by continuing the while loop
      continue;
    }
    const currentNode = map[curY][curX];
    // If any beam has entered this node from this direction before, kill the beam
    if (currentNode.enteredFrom[beam.from]) {
      // kill the beam by continuing the while loop
      continue;
    } else {
      // otherwise mark that we entered from this direction before
      currentNode.enteredFrom[beam.from] = true;
    }
    if (!currentNode.visited) {
      total++;
      currentNode.visited = true;
    }

    switch (currentNode.type) {
      case "empty":
        beams.push(beam);
        break;
      case "Lmirror":
        beam.changeDir(currentNode.reflect(beam.from));
        beams.push(beam);
        break;
      case "Rmirror":
        beam.changeDir(currentNode.reflect(beam.from));
        beams.push(beam);
        break;
      case "|":
        if (beam.from in currentNode.split) {
          let [dirA, dirB] = currentNode.split[beam.from];
          beam.changeDir(dirA);
          const newBeam = new Beam([curY, curX], dirB);
          beams.push(beam);
          beams.push(newBeam);
        } else {
          beams.push(beam);
        }
        break;
      case "-":
        if (beam.from in currentNode.split) {
          let [dirA, dirB] = currentNode.split[beam.from];
          beam.changeDir(dirA);
          const newBeam = new Beam([curY, curX], dirB);
          beams.push(beam);
          beams.push(newBeam);
        } else {
          beams.push(beam);
        }
        break;
    }
  }
  // console.log("number of affected nodes:", total);
  return total;
}

class Node {
  constructor() {
    this.enteredFrom = {
      N: false,
      S: false,
      E: false,
      W: false,
    };
    this.visited = false;
  }
}

class Beam {
  constructor(start, newDir) {
    this.dirs = {
      N: [-1, 0],
      S: [1, 0],
      E: [0, 1],
      W: [0, -1],
    };
    this.current = start;
    if (!"NESW".includes(newDir))
      throw new TypeError(`Error in dir specifier: ${newDir}`);
    this.vector = this.dirs[newDir];
    this.dir = newDir;
  }
  changeDir(newDir) {
    if (!"NESW".includes(newDir))
      throw new TypeError(`Error in dir specifier: ${newDir}`);
    this.vector = this.dirs[newDir];
    this.dir = newDir;
  }
  move() {
    const [curY, curX] = this.current;
    const [dirY, dirX] = this.vector;
    this.current = [curY + dirY, curX + dirX];
  }
  get from() {
    const dirMap = {
      N: "S",
      S: "N",
      E: "W",
      W: "E",
    };
    return dirMap[this.dir];
  }
}

class Reflector extends Node {
  constructor(type) {
    super();
    if (type !== "|" && type !== "-")
      throw new TypeError(`Unknown reflector type: ${type}`);
    this.type = type;
    if (type === "|") {
      this.split = {
        W: ["N", "S"],
        E: ["N", "S"],
      };
    } else {
      this.split = {
        N: ["W", "E"],
        S: ["W", "E"],
      };
    }
  }
}

class Mirror extends Node {
  constructor(type) {
    super();
    // "\" === Lmirror
    // "/" === Rmirror
    if (type !== "Lmirror" && type !== "Rmirror") {
      throw new TypeError(`Unknown mirror type: ${type}`);
    }
    // this.reflect = {};
    this.type = type;
    if (type === "Lmirror") {
      this._reflect = {
        N: "E",
        S: "W",
        E: "N",
        W: "S",
      };
    } else {
      this._reflect = {
        N: "W",
        S: "E",
        E: "S",
        W: "N",
      };
    }
  }
  reflect(from) {
    if (!"NESW".includes(from))
      throw new TypeError(`Error in dir specifier: ${from}`);
    return this._reflect[from];
  }
}

class Empty extends Node {
  constructor() {
    super();
    this.type = "empty";
  }
}

run({
  part1: {
    tests: [
      {
        input: `
          .|...\\....
          |.-.\\.....
          .....|-...
          ........|.
          ..........
          .........\\
          ..../.\\\\..
          .-.-/..|..
          .|....-|.\\
          ..//.|....
        `,
        expected: 46,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          .|...\\....
          |.-.\\.....
          .....|-...
          ........|.
          ..........
          .........\\
          ..../.\\\\..
          .-.-/..|..
          .|....-|.\\
          ..//.|....
        `,
        expected: 51,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
