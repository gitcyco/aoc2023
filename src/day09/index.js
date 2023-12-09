import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  const data = lines.map((e) => e.trim().split(" ").map(Number));
  return process(data);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  const data = lines.map((e) => e.trim().split(" ").map(Number).reverse());
  return process(data);
};

run({
  part1: {
    tests: [
      {
        input: `
          0 3 6 9 12 15
          1 3 6 10 15 21
          10 13 16 21 30 45
        `,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          0 3 6 9 12 15
          1 3 6 10 15 21
          10 13 16 21 30 45
        `,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

function process(data) {
  let sum = 0;
  for (let row of data) {
    let all = [];
    explore(row, all);
    let next = 0;
    for (let item of all) next += item[item.length - 1];
    sum += next + row[row.length - 1];
  }
  return sum;
}

function explore(arr, all) {
  let out = [];
  if (arr.every((e) => e === 0)) return 0;
  for (let i = 1; i < arr.length; i++) {
    out.push(arr[i] - arr[i - 1]);
  }
  all.push(out);
  return explore(out, all);
}
