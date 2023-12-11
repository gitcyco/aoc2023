import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90-degree bend connecting north and east.
// J is a 90-degree bend connecting north and west.
// 7 is a 90-degree bend connecting south and west.
// F is a 90-degree bend connecting south and east.
// . is ground; there is no pipe in this tile.
// S is the starting position of the animal;

const dirs = [
  [-1, 0], // North
  [1, 0], // South
  [0, 1], // East
  [0, -1], // West
];

const legend = {
  "|": [dirs[0], dirs[1]],
  F: [dirs[2], dirs[1]],
  7: [dirs[3], dirs[1]],
  L: [dirs[0], dirs[2]],
  J: [dirs[0], dirs[3]],
  "-": [dirs[2], dirs[3]],
  ".": [[], []],
};

const lookup = Object.keys(legend).reduce((a, e) => {
  let [curA, curB] = legend[e];
  a[`${curA.toString()},${curB.toString()}`] = e;
  a[`${curB.toString()},${curA.toString()}`] = e;
  return a;
}, {});

function findStartShape(startX, startY, map) {
  const [yLen, xLen] = [map.length, map[0].length];
  let shapeA = null;
  let shapeB = null;
  for (let [dirY, dirX] of dirs) {
    let x = dirX + startX;
    let y = dirY + startY;
    if (x >= 0 && x < xLen && y >= 0 && y < yLen) {
      const sym = map[y][x];
      for (let [testDirY, testDirX] of legend[sym]) {
        let [testY, testX] = [y + testDirY, x + testDirX];
        if (testY === startY && testX === startX) {
          if (!shapeA) {
            let [rY, rX] = [-testDirY + 0, -testDirX + 0];
            shapeA = [rY, rX];
          } else {
            let [rY, rX] = [-testDirY + 0, -testDirX + 0];
            shapeB = [rY, rX];
            return lookup[`${shapeA.toString()},${shapeB.toString()}`];
          }
        }
      }
    }
  }
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const map = input.split("\n").map((e) => e.split(""));
  const visited = new Array(map.length)
    .fill(0)
    .map((e) => new Array(map[0].length).fill(false));
  // console.log(map);
  const [startX, startY] = findStartS(map);
  const startShape = findStartShape(startX, startY, map);
  visited[startY][startX] = true;
  const [yLen, xLen] = [map.length, map[0].length];
  let maxDist = 0;
  let distA = 1;
  let distB = 1;
  let dirA = legend[startShape][0];
  let dirB = legend[startShape][1];
  let [pathAY, pathAX] = [startY + dirA[0], startX + dirA[1]];
  let [pathBY, pathBX] = [startY + dirB[0], startX + dirB[1]];
  while (!(pathAY === pathBY && pathAX === pathBX)) {
    visited[pathAY][pathAX] = true;
    visited[pathBY][pathBX] = true;
    let symA = map[pathAY][pathAX];
    let symB = map[pathBY][pathBX];
    // console.log("symA:", symA, "symB:", symB);
    for (let [dirY, dirX] of legend[symA]) {
      let [y, x] = [pathAY + dirY, pathAX + dirX];
      if (x >= 0 && x < xLen && y >= 0 && y < yLen) {
        if (!visited[y][x]) {
          pathAY = y;
          pathAX = x;
          distA++;
          maxDist = Math.max(distA, maxDist);
          break;
        }
      }
    }
    for (let [dirY, dirX] of legend[symB]) {
      let [y, x] = [pathBY + dirY, pathBX + dirX];
      if (x >= 0 && x < xLen && y >= 0 && y < yLen) {
        if (!visited[y][x]) {
          pathBY = y;
          pathBX = x;
          distB++;
          maxDist = Math.max(distB, maxDist);
          break;
        }
      }
    }
  }
  visited[pathAY][pathAX] = true;
  visited[pathBY][pathBX] = true;
  let newMap = visited.map((e, y) => e.map((v, x) => (v ? map[y][x] : " ")));
  newMap[startY][startX] = startShape;
  // console.log(newMap);
  return maxDist;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const map = processMap(input);
  const [yLen, xLen] = [map.length, map[0].length];
  let [startY, startX] = [-1, -1];
  // find starting point, must be 'F' as this is the first corner of the map we will run into
  for (let y = 0; y < yLen && startY < 0; y++) {
    for (let x = 0; x < xLen && startX < 0; x++) {
      if (map[y][x] === "F") {
        startY = y;
        startX = x;
      }
    }
  }
  console.log("Starting point:", startY, startX);
  const flipX = (coord) => [coord[0], -coord[1]];
  const flipY = (coord) => [-coord[0], coord[1]];
  const pairs = {
    F: { 7: flipX, L: flipY },
    7: { F: flipX, J: flipY },
    L: { J: flipX, F: flipY },
    J: { L: flipX, 7: flipY },
  };
  let insideA = [1, 1];
  let insideB = [1, 1];
  let curDirA = "F";
  let curDirB = "F";
  const visited = new Array(map.length)
    .fill(0)
    .map((e) => new Array(map[0].length).fill(false));
  visited[startY][startX] = true;

  // Now walk the whole map again:
  let dirA = legend[curDirA][0];
  let dirB = legend[curDirB][1];
  let [pathAY, pathAX] = [startY + dirA[0], startX + dirA[1]];
  let [pathBY, pathBX] = [startY + dirB[0], startX + dirB[1]];
  // Make one loop through the map, stop when we hit the start point
  while (!(pathAY === pathBY && pathAX === pathBX)) {
    visited[pathAY][pathAX] = true;
    visited[pathBY][pathBX] = true;
    let symA = map[pathAY][pathAX];
    let symB = map[pathBY][pathBX];

    // Change dirs for symA
    if (symA in pairs[curDirA]) {
      insideA = pairs[curDirA][symA](insideA);
    }
    if (symA !== "|" && symA !== "-") curDirA = symA;
    // console.log("pathA:", symA, pathAY, pathAX, insideA);

    // Change dirs for symB
    if (symB in pairs[curDirB]) {
      insideB = pairs[curDirB][symB](insideB);
    }
    if (symB !== "|" && symB !== "-") curDirB = symB;
    // console.log("pathB:", symB, pathBY, pathBX, insideB);

    // for the current coordinate (A & B) check the corresponding insideA or insideB
    // directions for an empty space. If it exists, crawl it and mark everything inside
    // with an I.

    if (map[pathAY + insideA[0]][pathAX] === " ")
      crawlSpace(pathAY + insideA[0], pathAX, map, visited);
    if (map[pathAY][pathAX + insideA[1]] === " ")
      crawlSpace(pathAY, pathAX + insideA[1], map, visited);

    if (map[pathBY + insideB[0]][pathBX] === " ")
      crawlSpace(pathBY + insideB[0], pathBX, map, visited);
    if (map[pathBY][pathBX + insideB[1]] === " ")
      crawlSpace(pathBY, pathBX + insideB[1], map, visited);

    for (let [dirY, dirX] of legend[symA]) {
      let [y, x] = [pathAY + dirY, pathAX + dirX];
      if (x >= 0 && x < xLen && y >= 0 && y < yLen && !visited[y][x]) {
        pathAY = y;
        pathAX = x;
        break;
      }
    }
    for (let [dirY, dirX] of legend[symB]) {
      let [y, x] = [pathBY + dirY, pathBX + dirX];
      if (x >= 0 && x < xLen && y >= 0 && y < yLen && !visited[y][x]) {
        pathBY = y;
        pathBX = x;
        break;
      }
    }
  }
  visited[pathAY][pathAX] = true;
  visited[pathBY][pathBX] = true;
  // map.forEach((e) => console.log(e.toString()));
  let count = 0;
  for (let row of map) {
    for (let col of row) {
      if (col === "I") count++;
    }
  }
  return count;
};

function crawlSpace(startY, startX, map, visited) {
  visited[startY][startX] = true;
  map[startY][startX] = "I";
  const [yLen, xLen] = [map.length, map[0].length];
  const queue = [[startY, startX]];
  while (queue.length) {
    const [curY, curX] = queue.pop();
    for (let [dirY, dirX] of dirs) {
      let [y, x] = [curY + dirY, curX + dirX];
      if (
        x >= 0 &&
        x < xLen &&
        y >= 0 &&
        y < yLen &&
        !visited[y][x] &&
        map[y][x] === " "
      ) {
        map[y][x] = "I";
        queue.push([y, x]);
      }
    }
  }
}

function processMap(input) {
  const map = input.split("\n").map((e) => e.split(""));
  const visited = new Array(map.length)
    .fill(0)
    .map((e) => new Array(map[0].length).fill(false));
  const [startX, startY] = findStartS(map);
  const startShape = findStartShape(startX, startY, map);
  visited[startY][startX] = true;
  const [yLen, xLen] = [map.length, map[0].length];
  let dirA = legend[startShape][0];
  let dirB = legend[startShape][1];
  let [pathAY, pathAX] = [startY + dirA[0], startX + dirA[1]];
  let [pathBY, pathBX] = [startY + dirB[0], startX + dirB[1]];
  while (!(pathAY === pathBY && pathAX === pathBX)) {
    visited[pathAY][pathAX] = true;
    visited[pathBY][pathBX] = true;
    let symA = map[pathAY][pathAX];
    let symB = map[pathBY][pathBX];
    for (let [dirY, dirX] of legend[symA]) {
      let [y, x] = [pathAY + dirY, pathAX + dirX];
      if (x >= 0 && x < xLen && y >= 0 && y < yLen && !visited[y][x]) {
        pathAY = y;
        pathAX = x;
        break;
      }
    }
    for (let [dirY, dirX] of legend[symB]) {
      let [y, x] = [pathBY + dirY, pathBX + dirX];
      if (x >= 0 && x < xLen && y >= 0 && y < yLen && !visited[y][x]) {
        pathBY = y;
        pathBX = x;
        break;
      }
    }
  }
  visited[pathAY][pathAX] = true;
  visited[pathBY][pathBX] = true;
  let newMap = visited.map((e, y) => e.map((v, x) => (v ? map[y][x] : " ")));
  newMap[startY][startX] = startShape;
  // newMap.forEach((e) => console.log(e.toString()));
  return newMap;
}

function findStartS(map) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === "S") return [x, y];
    }
  }
}

run({
  part1: {
    tests: [
      {
        input: `
          ..F7.
          .FJ|.
          SJ.L7
          |F--J
          LJ...
        `,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          FF7FSF7F7F7F7F7F---7
          L|LJ||||||||||||F--J
          FL-7LJLJ||||||LJL-77
          F--JF--7||LJLJ7F7FJ-
          L---JF-JLJ.||-FJLJJ7
          |F|F-JF---7F7-L7L|7|
          |FFJF7L7F-JF7|JL---7
          7-L-JL7||F7|L7F-7F7|
          L.L7LFJ|||||FJL7||LJ
          L7JLJL-JLJLJL--JLJ.L
        `,
        expected: 10,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
