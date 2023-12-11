import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

function getDist([aY, aX], [bY, bX]) {
  return Math.abs(aX - bX) + Math.abs(aY - bY);
}

function calcOffset(coord, offsets, expansion) {
  let found = false;
  let num = 0;
  for (let i = 1; i <= offsets.length; i++) {
    if (coord > offsets[i - 1]) {
      num = i;
      found = true;
    }
  }
  if (found) {
    let val = expansion * num - num;
    return coord + val;
  }
  return coord;
}

function calcDistances(map, expansion) {
  let [yLen, xLen] = [map.length, map[0].length];
  let eRows = [];
  let eCols = [];
  let num = 1;
  const coords = [];
  for (let y = 0; y < yLen; y++) {
    let found = false;
    for (let x = 0; x < xLen; x++) {
      if (map[y][x] === "#") {
        map[y][x] = num++;
        coords.push([map[y][x], [y, x]]);
        found = true;
      }
    }
    if (!found) eRows.push(y);
  }
  for (let x = 0; x < xLen; x++) {
    let found = false;
    for (let y = 0; y < yLen; y++) {
      if (map[y][x] !== ".") found = true;
    }
    if (!found) eCols.push(x);
  }

  const dists = [];
  const visited = {};
  for (let coordA = 0; coordA < coords.length; coordA++) {
    for (let coordB = 0; coordB < coords.length; coordB++) {
      let aName = coords[coordA][0];
      let bName = coords[coordB][0];
      if (
        coordA !== coordB &&
        !visited[aName]?.includes(bName) &&
        !visited[bName]?.includes(aName)
      ) {
        if (aName in visited) visited[aName].push(bName);
        else visited[aName] = [bName];
        if (bName in visited) visited[bName].push(aName);
        else visited[bName] = [aName];

        // calculate new x and y coord here from its position compared
        // to eRow and eCol and then get the manhattan distance

        let [coordAY, coordAX] = coords[coordA][1];
        let [coordBY, coordBX] = coords[coordB][1];

        dists.push(
          getDist(
            [
              calcOffset(coordAY, eRows, expansion),
              calcOffset(coordAX, eCols, expansion),
            ],
            [
              calcOffset(coordBY, eRows, expansion),
              calcOffset(coordBX, eCols, expansion),
            ],
          ),
        );
      }
    }
  }
  return dists.reduce((a, e) => a + e);
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n").map((e) => e.split(""));

  return calcDistances(lines, 2);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n").map((e) => e.split(""));

  return calcDistances(lines, 1000000);
};

run({
  part1: {
    tests: [
      {
        input: `
            ...#......
            .......#..
            #.........
            ..........
            ......#...
            .#........
            .........#
            ..........
            .......#..
            #...#.....
          `,
        expected: 374,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
            ...#......
            .......#..
            #.........
            ..........
            ......#...
            .#........
            .........#
            ..........
            .......#..
            #...#.....
          `,
        expected: 82000210,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
