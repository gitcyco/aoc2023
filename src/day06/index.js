import run from "aocrunner";
import { count } from "console";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  const times = lines[0]
    .replace("Time:", "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map(Number);
  const dists = lines[1]
    .replace("Distance:", "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map(Number);
  let ways = [];
  for (let i = 0; i < times.length; i++) {
    let time = times[i];
    let dist = dists[i];
    let count = 0;
    for (let j = 0; j < time; j++) {
      let tmpDist = j * (time - j);
      if (tmpDist > dist) count++;
    }
    ways.push(count);
  }
  return ways.reduce((a, e) => a * e);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  const time = +lines[0]
    .replace("Time:", "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .join("");
  const dist = +lines[1]
    .replace("Distance:", "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .join("");
  let count = 0;
  for (let j = 0; j < time; j++) {
    let tmpDist = j * (time - j);
    if (tmpDist > dist) count++;
  }
  return count;
};

run({
  part1: {
    tests: [
      {
        input: `
          Time:      7  15   30
          Distance:  9  40  200
        `,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          Time:      7  15   30
          Distance:  9  40  200
        `,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
