// const fs = require("node:fs");
import fs from "node:fs";

const input = fs.readFileSync("./input.txt", "utf8");
console.log(input);

console.log(execute(input));

function execute(input) {
  let mountains = input.split("\r\n\r\n").map((m) => m.split("\r\n"));
  let total = 0,
    secondTotal = 0;
  for (let i = 0; i < mountains.length; i++) {
    const mountain = mountains[i];
    console.log(
      "\n\n----------------------------- Mountain -----------------------------",
    );
    let mirror = findMirror(mountain);
    console.log("part 1 : ");
    // showMountain(mountain, mirror);
    total += mirror[1] * mirror[2];
    // mirror = findMirror(mountain, 1);
    // console.log("part 2 : ");
    // showMountain(mountain, mirror);
    secondTotal += mirror[1] * mirror[2];
  }
  return [total, secondTotal];
}

function showMountain(m, mirror) {
  let o = "";
  m.forEach((l, y) => {
    let s = "";
    for (let x = 0; x < l.length; x++) {
      if (mirror[2] == 1 && (x == mirror[1] || x == mirror[1] - 1))
        s += "\x1b[31m" + l[x] + "\x1b[0m";
      else if (
        mirror[2] == 1 &&
        x >= mirror[1] - mirror[0] &&
        x < mirror[1] + mirror[0]
      )
        s += "\x1b[32m" + l[x] + "\x1b[0m";
      else s += l[x];
    }
    if (mirror[2] == 100 && (y == mirror[1] || y == mirror[1] - 1))
      s = "\x1b[31m" + s + "\x1b[0m";
    else if (
      mirror[2] == 100 &&
      y >= mirror[1] - mirror[0] &&
      y < mirror[1] + mirror[0]
    )
      s = "\x1b[32m" + s + "\x1b[0m";
    o += s + "\n";
  });
  console.log(o);
}

function findMirror(mountain, part = 0) {
  let mirror = [-1, -1];
  for (let y = 1; y < mountain.length; y++) {
    let ref = compareReflections(mountain[y - 1], mountain[y], part);
    if (ref[0]) {
      let s = getReflectionSize(y, mountain, true, part);
      // console.log(s);
      if (y - s == 0 || mountain.length - y - s == 0) {
        mirror = [s, y, 100];
      }
    }
  }
  for (let x = 1; x < mountain[0].length; x++) {
    let ref = compareReflections(
      getColumn(mountain, x - 1),
      getColumn(mountain, x),
      part,
    );
    if (ref[0]) {
      let s = getReflectionSize(x, mountain, false, part);
      // console.log(s);
      if (x - s == 0 || mountain[0].length - x - s == 0) {
        mirror = [s, x, 1];
      }
    }
  }
  console.log(mirror[1]);
  return mirror;
}

function getReflectionSize(mirrorPos, mountain, horizontal, part) {
  let size = 0,
    maxLen = horizontal ? mirrorPos : mirrorPos,
    jokers = part;
  for (let i = 0; i < maxLen; i++) {
    let line1 = horizontal
      ? getRow(mountain, mirrorPos - i - 1)
      : getColumn(mountain, mirrorPos - i - 1);
    let line2 = horizontal
      ? getRow(mountain, mirrorPos + i)
      : getColumn(mountain, mirrorPos + i);
    let res = compareReflections(line1, line2, jokers);
    if (res[0] && res[1] >= 0) size++;
    else break;
    jokers = res[1];
  }
  if (jokers > 0) size = 0;
  console.log(size);
  return size;
}

function getRow(m, y) {
  if (y < 0 || y >= m.length) return "";
  else return m[y];
}

function getColumn(m, x) {
  if (x < 0 || x > m[0].length) return "";
  let s = "";
  for (let i = 0; i < m.length; i++) s += m[i][x];
  return s;
}

function compareReflections(line1, line2, jokers) {
  if (!line1 || !line2) return [false, jokers];
  for (let i = 0; i < line1.length; i++) {
    if (line1[i] != line2[i] && jokers > 0) jokers--;
    else if (line1[i] != line2[i]) return [false, jokers];
  }
  return [true, jokers];
}
