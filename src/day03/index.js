import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const grid = input.split("\n");
  let sum = 0;
  let num = "";
  let found = false;
  for (let y = 0; y < grid.length; y++) {
    if (found && num.length > 0) {
      sum += +num;
      found = false;
      num = "";
    }
    for (let x = 0; x < grid[0].length; x++) {
      const char = grid[y][x];
      if (/\d/.test(char)) {
        num += char;
        if (!found) found = checksymbols(x, y, grid);
      } else {
        if (found) sum += +num;
        num = "";
        found = false;
      }
    }
  }
  if (found && num.length > 0) sum += +num;
  return sum;
};

function checksymbols(x, y, grid) {
  const xLen = grid[0].length - 1;
  const yLen = grid.length - 1;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  for (let [xDir, yDir] of dirs) {
    const [nX, nY] = [x + xDir, y + yDir];
    if (nX < 0 || nX > xLen || nY < 0 || nY > yLen) continue;
    const char = grid[nY][nX];
    if (/[^\d.]/i.test(char)) {
      return true;
    }
  }
  return false;
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const grid = input.split("\n");
  const gears = {};
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const char = grid[y][x];
      if (char === "*") {
        // check all neighbors for a number
        checkGears(x, y, grid, gears);
      }
    }
  }
  let sum = 0;
  for (let gear of Object.keys(gears)) {
    if (gears[gear].numbers.length === 2) {
      sum += gears[gear].numbers.reduce((a, e) => +a * +e);
    }
  }
  return sum;
};

function checkGears(x, y, grid, gears) {
  const xLen = grid[0].length - 1;
  const yLen = grid.length - 1;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  gears[`${x},${y}`] = { visited: {}, numbers: [] };
  for (let [xDir, yDir] of dirs) {
    const [nX, nY] = [x + xDir, y + yDir];
    if (nX < 0 || nX > xLen || nY < 0 || nY > yLen) continue;
    const char = grid[nY][nX];
    if (/\d/.test(char)) {
      let startX = getStart(nX, nY, grid);
      let num = "";
      let skip = false;
      for (let tX = startX; tX <= xLen; tX++) {
        let char = grid[nY][tX];
        if (gears[`${x},${y}`].visited[`${tX},${nY}`]) {
          skip = true;
          num = "";
          break;
        }
        if (/\d/.test(char)) {
          gears[`${x},${y}`].visited[`${tX},${nY}`] = true;
          num += grid[nY][tX];
        } else break;
      }
      if (!skip) gears[`${x},${y}`].numbers.push(num);
    }
  }
}

function getStart(x, y, grid) {
  if (x === 0) return x;
  let row = grid[y];
  // backtrack the number to find the start coordinate
  for (; x >= 0; x--) {
    if (/[^\d]/.test(row[x])) break;
  }
  x++;
  if (/\d/.test(row[x])) return x;
}

run({
  part1: {
    tests: [
      {
        input: `
          467....114
          ../.......
          .35....633
          ......#...
          617.......
          *....+..58
          .....592..
          755.......
          $......*..
          664....598
        `,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          467..114..
          ...*......
          ..35..633.
          ......#...
          617*......
          .....+.58.
          ..592.....
          ......755.
          ...$.*....
          .664.598..
        `,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
