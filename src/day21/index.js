import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

function findStart(map) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === "S") return [y, x];
    }
  }
}

function getAdj([y, x], map) {
  let [yLen, xLen] = [map.length, map[0].length];
  let dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  let adjList = [];
  for (let [dirY, dirX] of dirs) {
    const [curY, curX] = [y + dirY, x + dirX];
    if (
      curY >= 0 &&
      curY < yLen &&
      curX >= 0 &&
      curX < xLen &&
      (map[curY][curX] === "." || map[curY][curX] === "S")
    ) {
      adjList.push([curY, curX]);
    }
  }
  return adjList;
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  const start = findStart(lines);
  console.log(start);
  let points = new Map();
  points.set(`${start[0]},${start[1]}`, true);
  let distance = 64;
  for (let i = 0; i < distance; i++) {
    let coords = points.keys();
    points = new Map();
    for (let coord of coords) {
      let [y, x] = coord.split(",");
      let adj = getAdj([+y, +x], lines);
      if (adj.length > 0) {
        for (let a of adj) {
          // if (!points.has(`${a[0]},${a[1]}`))
          points.set(`${a[0]},${a[1]}`, true);
        }
      }
    }
  }
  const temp = [...lines].map((e) => e.split(""));
  for (let point of points.keys()) {
    let [y, x] = point.split(",");
    temp[+y][+x] = "O";
    // console.log("point:", point);
  }
  // for (let row of temp) {
  //   console.log(row.join(""));
  // }
  // console.log(points, points.size);
  return points.size;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `
          ...........
          .....###.#.
          .###.##..#.
          ..#.#...#..
          ....#.#....
          .##..S####.
          .##..#...#.
          .......##..
          .##.#.####.
          .##..##.##.
          ...........
        `,
        expected: 16,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
