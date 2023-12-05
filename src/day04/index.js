import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const cards = input.split("\n").map((e) => e.replace(/^Card \d+:/i, ""));
  // console.log(cards);
  let winnings = 0;
  for (let card of cards) {
    let [win, nums] = card.trim().split("|");
    win = win
      .split(" ")
      .map((e) => e.trim())
      .filter((e) => +e > 0)
      .reduce((a, e) => ((a[e] = true), a), {});
    nums = nums
      .split(" ")
      .map((e) => +e.trim())
      .reduce((a, e) => {
        if (e in win) a++;
        return a;
      }, 0);
    if (nums > 0) winnings += 2 ** (nums - 1);
  }
  return winnings;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const cards = input.split("\n").map((e) =>
    e.replace(/^Card\s+([\d]+):/i, (e, c) => {
      // console.log(`${e} ::: ${c}`);
      return `${c}:`;
    }),
  );
  // console.log(cards);
  const deck = [];
  for (let card of cards) {
    let [num, rest] = card.trim().split(":");
    let [win, nums] = rest.trim().split("|");
    // console.log(num, win, nums);
    win = win
      .split(" ")
      .map((e) => e.trim())
      .filter((e) => +e > 0)
      .reduce((a, e) => ((a[e] = true), a), {});
    nums = nums
      .split(" ")
      .map((e) => +e.trim())
      .reduce((a, e) => {
        if (e in win) a++;
        return a;
      }, 0);
    const obj = {};
    deck.push([nums, 1]);
  }
  for (let i = 0; i < deck.length; i++) {
    let [w, count] = deck[i];
    for (let j = 1; j <= w; j++) {
      deck[i + j][1] += count;
    }
  }
  // console.log(deck);
  return deck.reduce((a, e) => a + e[1], 0);
};

run({
  part1: {
    tests: [
      {
        input: `
          Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
          Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
          Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
          Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
          Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
          Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
        `,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
          Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
          Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
          Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
          Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
          Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
        `,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
