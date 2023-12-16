import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const grid = input.split("\n");
  const height = grid.length;
  const width = grid[0].length;
  const columns = new Array(width).fill(0);

  for (let x = 0; x < width; x++) {
    let rockCount = 0;
    let start = height;
    if (x === 5) {
      let nothing;
    }
    for (let y = 0; y < height; y++) {
      if (grid[y][x] === "#") {
        // reset our top point
        start = height - y - 1;
        rockCount = 0;
      }
      if (grid[y][x] === "O") {
        columns[x] += start - rockCount;
        rockCount++;
      }
    }
  }
  console.log(columns);
  console.log(
    "result:",
    columns.reduce((a, e) => a + e),
  );
  return columns.reduce((a, e) => a + e);
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
          O....#....
          O.OO#....#
          .....##...
          OO.#O....O
          .O.....O#.
          O.#..O.#.#
          ..O..#O..O
          .......O..
          #....###..
          #OO..#....
        `,
        expected: 136,
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
