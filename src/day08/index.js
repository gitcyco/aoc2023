import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n").filter((e) => e.length);
  const code = lines.shift();
  const graph = lines.reduce((obj, e) => {
    const [node, items] = e.split(" = ");
    const [left, right] = items.replace(/[() ]/g, "").split(",");
    obj[node] = {};
    obj[node].L = left;
    obj[node].R = right;
    return obj;
  }, {});

  let count = 0;
  let i = 0;
  let cur = "AAA";
  while (cur !== "ZZZ") {
    cur = graph[cur][code[i]];
    // let curIns = code[i];
    // let adjList = graph[cur];
    // cur = adjList[curIns];
    i = (i + 1) % code.length;
    count++;
  }
  return count;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n").filter((e) => e.length);
  const code = lines.shift();
  const graph = lines.reduce((obj, e) => {
    const [node, items] = e.split(" = ");
    const [left, right] = items.replace(/[() ]/g, "").split(",");
    obj[node] = {};
    obj[node].L = left;
    obj[node].R = right;
    return obj;
  }, {});

  let count = 0;
  let loop = 0;
  let i = 0;
  // console.log(graph);
  let current = Object.keys(graph).filter((e) => /^..A$/.test(e));
  console.log(current);

  let dists = [];
  for (let cur of current) {
    count = 0;
    while (!/^..Z$/.test(cur)) {
      cur = graph[cur][code[i]];
      i = (i + 1) % code.length;
      count++;
    }
    dists.push(count);
  }
  return lcmm(dists);

  // Brute force does NOT work, solution is way too huge.
  //
  //   let test = current.every((e) => /^..A$/.test(e));
  //   console.log(test);
  //   while (!current.every((e) => /^..Z$/.test(e))) {
  //     current = current.map((cur) => {
  //       let curIns = code[i];
  //       let adjList = graph[cur];
  //       cur = adjList[curIns];
  //       return cur;
  //     });
  //
  //     i = (i + 1) % code.length;
  //     count++;
  //     // loop++;
  //   }
  // console.log(count);
  return count;
};

run({
  part1: {
    tests: [
      {
        input: `
          LLR

          AAA = (BBB, BBB)
          BBB = (AAA, ZZZ)
          ZZZ = (ZZZ, ZZZ)
        `,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          LR

          11A = (11B, XXX)
          11B = (XXX, 11Z)
          11Z = (11B, XXX)
          22A = (22B, XXX)
          22B = (22C, 22C)
          22C = (22Z, 22Z)
          22Z = (22B, 22B)
          XXX = (XXX, XXX)
        `,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

function gcd(a, b) {
  // Euclidean algorithm
  while (b != 0) {
    var temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function lcmm(args) {
  // Recursively iterate through pairs of arguments
  // i.e. lcm(args[0], lcm(args[1], lcm(args[2], args[3])))

  if (args.length == 2) {
    return lcm(args[0], args[1]);
  } else {
    var arg0 = args[0];
    args.shift();
    return lcm(arg0, lcmm(args));
  }
}
