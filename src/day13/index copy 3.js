import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  let chunks = [];
  let tmp = [];
  // console.log(lines);
  for (let line of lines) {
    if (line.length > 0) tmp.push(line);
    else {
      chunks.push(tmp);
      tmp = [];
    }
  }
  chunks.push(tmp);
  chunks = chunks.map((chunk) => {
    const rows = chunk;
    const cols = [];
    for (let x = 0; x < chunk[0].length; x++) {
      const col = [];
      for (let y = 0; y < chunk.length; y++) {
        col.push(chunk[y][x]);
      }
      cols.push(col.join(""));
    }
    return [cols, rows];
  });
  // chunks.forEach((e) => {
  //   e.forEach((v) => {
  //     console.log(v.join("\n"));
  //     console.log("--------");
  //   });
  //   console.log("--------");
  // });

  let num = 0;
  let counter = 0;
  for (let [cols, rows] of chunks) {
    let result = 0;
    if (counter === 50) {
      let test;
    }
    let r1 = findCenter(cols);
    // console.log("cols:", r1, "\n", cols.join("\n"));
    // console.log("cols:", r1);
    if (r1 !== -1) {
      // console.log(r1);
      // console.log("cols:", r1, "\n", "num:", ++counter, "\n", cols.join("\n"));
    }
    if (r1 === -1) {
      let r2 = findCenter(rows);
      if (r2 !== -1) {
        // console.log(r2);
        // console.log(
        //   "rows:",
        //   r2,
        //   "\n",
        //   "num:",
        //   ++counter,
        //   "\n",
        //   rows.join("\n"),
        // );
      }
      // console.log("rows:", r2);
      if (r2 < 0)
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n", rows.join("\n"));
      result = r2 * 100;
    } else result = r1;
    // let result = findCenter(cols) + findCenter(rows) * 100;
    num += result;
  }
  console.log("num:", num);
  console.log("lev dist:", lev("abcdefghijklmn", "abcdefghijklmn"));
  return num;
};

function findCenter(a) {
  let arr = [...a];
  let pos = -1;

  let yA = 0;
  let yB = 1;
  let exit = false;
  // let diffCount = 0;
  while (yB < arr.length && !exit) {
    exit = false;
    if (arr[yA] === arr[yB]) {
      // let levDist1 = lev(arr[yA], arr[yB]);
      // if (levDist1 === 0) {
      // pos = yA;
      for (let y = 0; y <= yA; y++) {
        // console.log("comp:", arr[yA - y], arr[yB + y]);
        if (yB + y < arr.length && yA - y >= 0) {
          if (arr[yB + y] !== arr[yA - y] && yA - y >= 0) {
            // let levDist2 = lev(arr[yB + y], arr[yA - y]);
            // if (levDist2 > 0 && yA - y >= 0) {
            // console.log("not equal:", arr[yA - y], arr[yB + y], yA, yB);
            pos = -1;
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
  // console.log("pos:", pos, arr.length);
  // if (pos === 0) return arr.length - 1;
  if (pos === -1) return -1;
  return pos + 1;
  // return pos > 0 ? pos + 1 : arr.length;
}

function findCenterSmudge(arr) {
  let pos = -1;

  let yA = 0;
  let yB = 1;
  let exit = false;
  let diffCount = 0;
  while (yB < arr.length && !exit) {
    exit = false;
    let levDist1 = lev(arr[yA], arr[yB]);
    if (levDist1 > 0) diffCount += levDist1;
    // if (levDist1 < 2) {
    if (levDist1 === 0) {
      // pos = yA;
      for (let y = 0; y <= yA; y++) {
        // console.log("comp:", arr[yA - y], arr[yB + y]);
        if (yB + y < arr.length && yA - y >= 0) {
          let levDist2 = lev(arr[yB + y], arr[yA - y]);
          if (levDist2 > 0) diffCount += levDist2;
          if (levDist2 > 1 && yA - y >= 0) {
            // console.log("not equal:", arr[yA - y], arr[yB + y], yA, yB);
            // diffCount = 0;
            pos = -1;
            break;
          } else if (diffCount > 1) {
            // diffCount = 0;
            pos = -1;
            break;
          }
        }
        if (yA - y === 0 && diffCount === 1) {
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
  // console.log("pos:", pos, arr.length);
  // if (pos === 0) return arr.length - 1;
  if (pos === -1) return -1;
  return pos + 1;
  // return pos > 0 ? pos + 1 : arr.length;
}
function findCenterBrute(a) {
  let arr = [...a];
  let result = -1;
  let test = findCenter(arr);
  // return findCenter(a);
  for (let y = 0; y < arr.length; y++) {
    for (let x = 0; x < arr[0].length; x++) {
      arr = [...a];
      // console.log("before:", arr);
      let row = arr[y].split("");
      if (row[x] === ".") row[x] = "#";
      else if (row[x] === "#") row[x] = ".";
      arr[y] = row.join("");
      // console.log("after:", arr);
      result = findCenter(arr);
      // console.log(result, y, x);
      // if (result > 0 && y <= result) {
      if (result > 0) {
        if (test > 0 && result === test) continue;
        // else if (result > 0) return result;
        console.log("fixed:", y, x, "::", result, test);
        return result;
      }
    }
  }
  console.log("final result:", result);
  return -1;
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  let chunks = [];
  let tmp = [];
  // console.log(lines);
  for (let line of lines) {
    if (line.length > 0) tmp.push(line);
    else {
      chunks.push(tmp);
      tmp = [];
    }
  }
  chunks.push(tmp);
  chunks = chunks.map((chunk) => {
    const rows = chunk;
    const cols = [];
    for (let x = 0; x < chunk[0].length; x++) {
      const col = [];
      for (let y = 0; y < chunk.length; y++) {
        col.push(chunk[y][x]);
      }
      cols.push(col.join(""));
    }
    return [cols, rows];
  });

  let num = 0;
  let counter = 0;
  for (let [cols, rows] of chunks) {
    let result = 0;
    if (counter === 50) {
      let test;
    }
    // let r1 = findCenterSmudge(cols);
    let r1 = findCenterBrute(rows);
    // console.log("cols:", r1, "\n", cols.join("\n"));
    // console.log("cols:", r1);
    if (r1 !== -1) {
      console.log(r1);
      // console.log("cols:", r1, "\n", "num:", ++counter, "\n", cols.join("\n"));
    }
    if (r1 === -1) {
      // let r2 = findCenterSmudge(rows);
      let r2 = findCenterBrute(cols);
      if (r2 !== -1) {
        console.log(r2);
        // console.log(
        //   "rows:",
        //   r2,
        //   "\n",
        //   "num:",
        //   ++counter,
        //   "\n",
        //   rows.join("\n"),
        // );
        // console.log("rows:", r2);
        // if (r2 < 0)
        //   console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n", rows.join("\n"));
        result = r2 * 100;
      } else result = r1;
    }
    // let result = findCenter(cols) + findCenter(rows) * 100;
    num += result;
  }
  console.log("num:", num);
  // console.log("lev dist:", lev("abcdefghijklmn", "abcdefghijklmn"));
  return num;
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
        expected: 400,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

function lev(s, t) {
  if (s === t) {
    return 0;
  }
  var n = s.length,
    m = t.length;
  if (n === 0 || m === 0) {
    return n + m;
  }
  var x = 0,
    y,
    a,
    b,
    c,
    d,
    g,
    h,
    k;
  var p = new Array(n);
  for (y = 0; y < n; ) {
    p[y] = ++y;
  }

  for (; x + 3 < m; x += 4) {
    var e1 = t.charCodeAt(x);
    var e2 = t.charCodeAt(x + 1);
    var e3 = t.charCodeAt(x + 2);
    var e4 = t.charCodeAt(x + 3);
    c = x;
    b = x + 1;
    d = x + 2;
    g = x + 3;
    h = x + 4;
    for (y = 0; y < n; y++) {
      k = s.charCodeAt(y);
      a = p[y];
      if (a < c || b < c) {
        c = a > b ? b + 1 : a + 1;
      } else {
        if (e1 !== k) {
          c++;
        }
      }

      if (c < b || d < b) {
        b = c > d ? d + 1 : c + 1;
      } else {
        if (e2 !== k) {
          b++;
        }
      }

      if (b < d || g < d) {
        d = b > g ? g + 1 : b + 1;
      } else {
        if (e3 !== k) {
          d++;
        }
      }

      if (d < g || h < g) {
        g = d > h ? h + 1 : d + 1;
      } else {
        if (e4 !== k) {
          g++;
        }
      }
      p[y] = h = g;
      g = d;
      d = b;
      b = c;
      c = a;
    }
  }

  for (; x < m; ) {
    var e = t.charCodeAt(x);
    c = x;
    d = ++x;
    for (y = 0; y < n; y++) {
      a = p[y];
      if (a < c || d < c) {
        d = a > d ? d + 1 : a + 1;
      } else {
        if (e !== s.charCodeAt(y)) {
          d = c + 1;
        } else {
          d = c;
        }
      }
      p[y] = d;
      c = a;
    }
    h = d;
  }

  return h;
}
