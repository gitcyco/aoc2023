import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  let sum = 0;
  for (let line of lines) {
    let num1 = line.match(/\d/)[0];
    let num2;
    for (let c of line) {
      if (/[\d]/.test(c)) num2 = c;
    }
    sum += parseInt(num1 + num2);
  }
  return sum;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  const map = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  };
  let sum = 0;
  for (let line of lines) {
    let num1 = line.match(/one|two|three|four|five|six|seven|eight|nine|\d/)[0];
    num1 = num1 in map ? map[num1] : num1;
    let num2;
    for (let i = 0; i < line.length; i++) {
      let str = line.slice(i);
      let m =
        str.match(/one|two|three|four|five|six|seven|eight|nine|\d/) || [];
      if (m.length > 0) num2 = m[0];
    }
    num2 = num2 in map ? map[num2] : num2;
    sum += parseInt(num1 + num2);
  }
  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `
        1abc2
        pqr3stu8vwx
        a1b2c3d4e5f
        treb7uchet
        `,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        two1nine
        eightwothree
        abcone2threexyz
        xtwone3four
        4nineeightseven2
        zoneight234
        7pqrstsixteen
        `,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
