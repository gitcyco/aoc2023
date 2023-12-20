import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const gt = (p, v) => p > v;
const lt = (p, v) => p < v;

function processItems(arr) {
  return arr.map((item) => {
    item = item.replace(/[{}]/g, "");
    let arr = item
      .split(",")
      .map((e) => e.split("=").map((v) => (isNaN(v) ? v : +v)));
    console.log(arr);
    return Object.fromEntries(arr);
  });
}
function processPipeline(pipeline) {
  const obj = {};
  for (let item of pipeline) {
    let [id, rest] = item.split("{");
    rest = rest.replace("}", "");
    let arr = rest.split(",");
    console.log(id, arr);
    obj[id] = [];
    for (let stop of arr) {
      if (stop.includes(":")) {
        let [cond, dest] = stop.split(":");
        if (cond.includes(">")) {
          let [p, v] = cond.split(">");
          obj[id].push({ param: p, func: gt, val: +v, route: dest });
        } else if (cond.includes("<")) {
          let [p, v] = cond.split("<");
          obj[id].push({ param: p, func: lt, val: +v, route: dest });
        } else
          throw new Error(
            `Unexpected comparison function: ${cond}, in: ${stop}`,
          );
      } else {
        obj[id].push({ param: null, func: null, val: null, route: stop });
      }
    }
  }
  return obj;
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  console.log(lines);
  const accepted = [];
  const rejected = [];
  let pipeline = [];
  let items = [];
  let temp = pipeline;
  for (let line of lines) {
    if (line.length === 0) temp = items;
    else temp.push(line);
  }
  items = processItems(items);
  const workFlow = processPipeline(pipeline);
  console.log("pipeline:", pipeline);
  console.log("items:", items);
  console.log("workflow:", workFlow);
  for (let chunk of items) {
    let curRoute = "in";
    let i = 0;
    while (curRoute !== "A" && curRoute !== "R" && i < 1000) {
      let cur = workFlow[curRoute];
      console.log(cur);
      for (let r of cur) {
        const { param, func, val, route } = r;
        if (param === null) {
          curRoute = route;
          break;
        } else {
          if (func(chunk[param], val)) {
            curRoute = route;
            break;
          }
        }
      }
      i++;
    }
    if (curRoute === "A") accepted.push(chunk);
    else if (curRoute === "R") rejected.push(chunk);
  }
  console.log("accepted:", accepted);
  console.log("rejected:", rejected);
  let sum = 0;
  for (let acc of accepted) {
    sum += Object.values(acc).reduce((a, e) => a + e, 0);
  }
  console.log(sum);
  return sum;
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
          px{a<2006:qkq,m>2090:A,rfg}
          pv{a>1716:R,A}
          lnx{m>1548:A,A}
          rfg{s<537:gd,x>2440:R,A}
          qs{s>3448:A,lnx}
          qkq{x<1416:A,crn}
          crn{x>2662:A,R}
          in{s<1351:px,qqz}
          qqz{s>2770:qs,m<1801:hdj,R}
          gd{a>3333:R,R}
          hdj{m>838:A,pv}

          {x=787,m=2655,a=1222,s=2876}
          {x=1679,m=44,a=2067,s=496}
          {x=2036,m=264,a=79,s=2244}
          {x=2461,m=1339,a=466,s=291}
          {x=2127,m=1623,a=2188,s=1013}
        `,
        expected: 19114,
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
