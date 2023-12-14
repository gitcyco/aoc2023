import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  let lines = input
    .split("\n")
    .map((e) => (e === "" ? "--" : e))
    .join("\n")
    .split("--")
    .map((e) => e.split("\n").filter(Boolean));

  let sum = 0;

  for (let i = 0; i < lines.length - 1; i += 2) {
    // let rows = lines[i];
    // let cols = lines[i + 1];
    let cols = [];
    let piece = lines[i];
    for (let x = 0; x < piece[0].length; x++) {
      const col = [];
      for (let y = 0; y < piece.length; y++) {
        col.push(piece[y][x]);
      }
      cols.push(col.join(""));
    }
    lines[i] = cols;
    let r1 = findCenter(cols);
    let r2 = findCenter(lines[i + 1]);
    // console.log("cols val:", r1);
    // console.log("rows val:", r2);
    sum += r1 + r2 * 100;
    // console.log("row:", rows);
    // console.log("col:", cols);
  }
  // console.log(lines);
  // console.log(sum);
  return sum;
  // let chunks = lines.split();

  // console.log(chunks);

  //
  //   let chunks = [];
  //   let tmp = [];
  //   console.log(lines);
  //   for (let line of lines) {
  //     if (line.length > 0) tmp.push(line);
  //     else {
  //       chunks.push(tmp);
  //       tmp = [];
  //     }
  //   }
  //   chunks.push(tmp);
  //   chunks = chunks.map((chunk) => {
  //     const rows = chunk;
  //     const cols = [];
  //     for (let x = 0; x < chunk[0].length; x++) {
  //       const col = [];
  //       for (let y = 0; y < chunk.length; y++) {
  //         col.push(chunk[y][x]);
  //       }
  //       cols.push(col.join(""));
  //     }
  //     return [cols, rows];
  //   });
  //   chunks.forEach((e) => {
  //     e.forEach((v) => {
  //       console.log(v.join("\n"));
  //       console.log("--------");
  //     });
  //     console.log("--------");
  //   });
  //
  //   let num = 0;
  //
  //   for (let [cols, rows] of chunks) {
  //     let r1 = findCenter(cols);
  //     console.log("cols:", r1);
  //     let r2 = findCenter(rows);
  //     console.log("rows:", r2);
  //     // let result = findCenter(cols) + findCenter(rows) * 100;
  //     // num += result;
  //   }
  //   console.log("num:", num);
  return;
};

function findCenter(arr) {
  let pos = 0;

  let yA = 0;
  let yB = 1;
  let exit = false;
  while (yB < arr.length && !exit) {
    let exit = false;
    if (arr[yA] === arr[yB]) {
      for (let y = 0; y <= yA; y++) {
        // console.log("comp:", arr[yA - y], arr[yB + y]);
        if (yB + y < arr.length && yA - y >= 0) {
          if (arr[yB + y] !== arr[yA - y] && yA - y > 0) {
            console.log("not equal:", arr[yA - y], arr[yB + y], yA, yB);
            pos = 0;
            break;
          }
        }
        if (yA - y === 0) {
          pos = yA;
          exit = true;
          // } else if (ya - y === 0 && yB + y)
          // if(yB + y < arr.length && arr[yA - y] === arr[yB + y]) continue;
          // if(yB + y < arr.length && arr[yA - y] !== arr[yB + y]) {
          break;
        }
      }
    }
    yA++;
    yB++;
  }
  console.log("pos:", pos, arr.length);
  if (pos === 0) return arr.length - 1;
  return pos + 1;
  // return pos > 0 ? pos + 1 : arr.length;
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `
          #.##..##.
          ..#.##.#.
          ##......#
          ##......#
          ..#.##.#.
          ..##..##.
          #.#.##.#.

          #...##..#
          #....#..#
          ..##..###
          #####.##.
          #####.##.
          ..##..###
          #....#..#
        `,
        expected: 405,
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
