import run from "aocrunner";
import MinHeap from "./MinHeap.mjs";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  const paths = [
    "seed",
    "soil",
    "fertilizer",
    "water",
    "light",
    "temperature",
    "humidity",
  ];
  const sources = lines[0]
    .replace("seeds:", "")
    .trim()
    .split(" ")
    .map((e) => parseInt(e.trim()));
  const map = mapInput(lines);
  const locations = new MinHeap();
  for (let seed of sources) {
    const location = getDist(seed, paths, map);
    locations.push(location);
  }
  return locations.pop();
};

function getDist(current, paths, map) {
  let loc, val;
  for (let route of paths) {
    const mapping = map[route];
    const { maps } = mapping;
    let found = false;
    for (let item of maps) {
      const [dest, src, range] = item;
      if (current < src + range && current >= src) {
        val = dest + (current - src);
        found = true;
      }
    }
    if (found) current = val;
  }
  return current;
}

function mapInput(lines) {
  const rawMaps = lines.slice(1).filter((e) => e);
  const map = {};
  let curKey = "";
  for (let i = 0; i < rawMaps.length; i++) {
    let item = rawMaps[i];
    if (item.includes("map:")) {
      let [keyFrom, keyTo] = item.replace(" map:", "").split("-to-");
      curKey = keyFrom;
      map[curKey] = { to: keyTo, maps: [] };
    } else {
      map[curKey].maps.push(item.split(" ").map((e) => +e.trim()));
    }
  }
  return map;
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  const paths = [
    "seed",
    "soil",
    "fertilizer",
    "water",
    "light",
    "temperature",
    "humidity",
  ];

  const sources = lines[0]
    .replace("seeds:", "")
    .trim()
    .split(" ")
    .map((e) => parseInt(e.trim()));
  let ranges = [];
  for (let i = 0; i < sources.length; i += 2) {
    ranges.push([sources[i], sources[i + 1]]);
  }
  console.log(ranges);
  const map = mapInput(lines);
  let min = Infinity;
  //
  // lol brute force isn't going to work: (it worked but took a long time)
  for (let [start, end] of ranges) {
    const startTime = performance.now();
    for (let i = 0; i < end; i++) {
      const location = getDist(start + i, paths, map);
      min = Math.min(min, location);
    }
    const endTime = performance.now();
    console.log(
      `Finished space ${start}->${end} with MIN: ${min} in ${
        (endTime - startTime) / 1000
      } seconds`,
    );
  }
  return min;
};

run({
  part1: {
    tests: [
      {
        input: `
          seeds: 79 14 55 13

          seed-to-soil map:
          50 98 2
          52 50 48

          soil-to-fertilizer map:
          0 15 37
          37 52 2
          39 0 15

          fertilizer-to-water map:
          49 53 8
          0 11 42
          42 0 7
          57 7 4

          water-to-light map:
          88 18 7
          18 25 70

          light-to-temperature map:
          45 77 23
          81 45 19
          68 64 13

          temperature-to-humidity map:
          0 69 1
          1 0 69

          humidity-to-location map:
          60 56 37
          56 93 4
        `,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          seeds: 79 14 55 13

          seed-to-soil map:
          50 98 2
          52 50 48

          soil-to-fertilizer map:
          0 15 37
          37 52 2
          39 0 15

          fertilizer-to-water map:
          49 53 8
          0 11 42
          42 0 7
          57 7 4

          water-to-light map:
          88 18 7
          18 25 70

          light-to-temperature map:
          45 77 23
          81 45 19
          68 64 13

          temperature-to-humidity map:
          0 69 1
          1 0 69

          humidity-to-location map:
          60 56 37
          56 93 4
        `,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
