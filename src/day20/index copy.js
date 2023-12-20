import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

class Counter {
  constructor() {
    this.high = 0;
    this.low = 0;
  }
  inc(bit) {
    if (bit) this.high++;
    else this.low++;
  }
}

class Generic {
  constructor(name) {
    this.high = 0;
    this.low = 0;
    this.type = "generic";
    this.bit = 0;
  }
  input(name, bit) {
    this.bit = bit;
    if (bit) this.high++;
    else this.low++;
  }
  setTarget(target) {
    return;
  }
  send(bit) {
    return;
  }
}

class Button {
  constructor(name, counter) {
    this.name = name;
    this.counter = counter;
    this.targets = [];
    this.type = "button";
    this.bit = 0;
  }
  setTarget(target) {
    this.targets.push(target);
  }
  send() {
    for (let target of this.targets) {
      this.counter.inc(this.bit);
      target.input(this.name, this.bit);
    }
    for (let target of this.targets) {
      target.send();
    }
  }
}

class Broadcaster {
  constructor(name, counter) {
    this.name = name;
    this.targets = [];
    this.counter = counter;
    this.type = "broadcaster";
    this.bit = 0;
  }
  setTarget(target) {
    this.targets.push(target);
  }
  input(name, bit) {
    // this.send(bit);
    this.bit = bit;
  }
  send() {
    let targetCache = [];
    for (let target of this.targets) {
      this.counter.inc(this.bit);
      target.input(this.name, this.bit);
      targetCache.push([target, this.bit]);
    }
    for (let target of this.targets) {
      target.send();
    }
  }
}

class Conjunction {
  constructor(name, counter) {
    this.memory = {};
    this.name = name;
    this.targets = [];
    this.counter = counter;
    this.type = "conjunction";
    this.bit = 0;
  }
  setTarget(target) {
    this.targets.push(target);
  }
  setInput(name) {
    this.memory[name] = 0;
  }
  input(name, bit) {
    this.memory[name] = bit;
    if (Object.values(this.memory).every((e) => e === 1)) {
      this.bit = 0;
    } else this.bit = 1;
  }
  send() {
    for (let target of this.targets) {
      this.counter.inc(this.bit);
      target.input(this.name, this.bit);
    }
    for (let target of this.targets) {
      target.send();
    }
  }
}

class FlipFlop {
  constructor(name, counter) {
    this.state = 0;
    this.name = name;
    this.targets = [];
    this.counter = counter;
    this.type = "flipflop";
    this.bit = 0;
  }
  setTarget(target) {
    this.targets.push(target);
  }
  input(name, bit) {
    this.bit = bit;
    if (bit) return;
    // If input bit is 0, flip state
    this.state = this.state ? 0 : 1;
    // Then forward that state to all targets
    // this.send();
  }
  send() {
    if (this.bit) return;
    for (let target of this.targets) {
      this.counter.inc(this.state);
      target.input(this.name, this.state);
    }
    for (let target of this.targets) {
      target.send();
    }
  }
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n").map((spec) => {
    spec = spec.replace(/\s/g, "");
    let [mod, targets] = spec.split("->");
    targets = targets.split(",");
    return { mod, targets };
  });
  const counter = new Counter();
  const modules = {};
  for (let module of lines) {
    if (module.mod === "broadcaster") {
      modules[module.mod] = new Broadcaster(module.mod, counter);
    } else if (module.mod[0] === "%") {
      let name = module.mod.slice(1);
      modules[name] = new FlipFlop(name, counter);
    } else if (module.mod[0] === "&") {
      let name = module.mod.slice(1);
      modules[name] = new Conjunction(name, counter);
    } else {
      modules[module.mod] = new Generic(module.mod);
    }
  }
  for (let module of lines) {
    let name = "";
    if (module.mod === "broadcaster") {
      name = "broadcaster";
    } else if (module.mod[0] === "%") {
      name = module.mod.slice(1);
    } else if (module.mod[0] === "&") {
      name = module.mod.slice(1);
    } else {
      name = module.mod;
    }
    module.targets.forEach((target) => {
      modules[name].setTarget(modules[target]);
      if (modules[target].type === "conjunction") {
        modules[target].setInput(name);
      }
    });
  }
  const button = new Button("button", counter);
  button.setTarget(modules["broadcaster"]);
  button.send(0);

  // a updates b before b gets a chance to run with the low signal
  // that was sent from broadcaster

  // for (let i = 0; i < 1000; i++) {
  //   button.send(0);
  // }
  console.log(button, modules, counter);
  console.log("OUTPUT TOTAL:", counter.high * counter.low);
  return;
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
          broadcaster -> a, b, c
          %a -> b
          %b -> c
          %c -> inv
          &inv -> a
        `,
        expected: 32000000,
        // input: `
        //   broadcaster -> a
        //   %a -> inv, con
        //   &inv -> b
        //   %b -> con
        //   &con -> output
        // `,
        // expected: 11687500,
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
  onlyTests: true,
});
