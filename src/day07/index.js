import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input
    .split("\n")
    .map((e) => e.trim().split(" "))
    .map((e) => [e[0], +e[1]]);
  const ranks = lines.length + 1;
  const hands = lines.map((e) => {
    const cards = e[0];
    const counts = cards
      .split("")
      .reduce((a, e) => (e in a ? a[e]++ : (a[e] = 1), a), {});
    return [counts, e[1], cards];
  });
  const order = [
    "A",
    "K",
    "Q",
    "J",
    "T",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
  ];
  const orderKey = order.reverse().reduce((a, e, i) => ((a[e] = i), a), {});
  const bestHands = hands.map(([hand, points, cards]) => {
    let vals = Object.values(hand);
    let keys = Object.keys(hand);
    if (vals.includes(5)) {
      // five of a kind
      // no need to return the repeated cards, just the ranking
      return [1, keys[vals.indexOf(5)].repeat(5), points, cards];
      return [1, keys[vals.indexOf(5)].repeat(5), points, cards];
    } else if (vals.includes(4)) {
      // four of a kind
      return [2, keys[vals.indexOf(4)], points, cards];
    } else if (vals.includes(3) && vals.includes(2)) {
      // full house
      return [
        3,
        keys[vals.indexOf(3)].repeat(3) + keys[vals.indexOf(2)].repeat(2),
        points,
        cards,
      ];
    } else if (vals.includes(3)) {
      // three of a kind
      return [4, keys[vals.indexOf(3)].repeat(3), points, cards];
    } else if (vals.includes(2) && vals.indexOf(2) !== vals.lastIndexOf(2)) {
      // two pair
      return [
        5,
        keys[vals.indexOf(2)].repeat(2) + keys[vals.lastIndexOf(2)].repeat(2),
        points,
        cards,
      ];
    } else if (vals.includes(2)) {
      // one pair
      return [6, keys[vals.indexOf(2)].repeat(2), points, cards];
    } else {
      for (let card of order.reverse()) {
        // THIS IS THE PROBLEM MOST LIKELY, FIX
        if (cards.includes(card)) {
          // console.log("high card", [7, card, points, cards]);
          return [7, card, points, cards];
        }
      }
      // return [0, 0, 0, 0, 0];
    }
  });
  let sorted = bestHands.sort((a, b) => {
    if (a[0] - b[0] === 0) {
      let handA = a[3];
      let handB = b[3];
      for (let i = 0; i < 5; i++) {
        if (handA[i] == handB[i]) continue;
        let aVal = orderKey[handA[i]];
        let bVal = orderKey[handB[i]];
        return aVal - bVal;
      }
    } else return b[0] - a[0];
  });
  let out = sorted.reduce((a, e, i) => {
    return a + e[2] * (i + 1);
  }, 0);
  return out;
};

// Five of a kind, where all five cards have the same label: AAAAA
// Four of a kind, where four cards have the same label and one card has a different label: AA8AA
// Full house, where three cards have the same label, and the remaining two cards share a different label: 23332
// Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: TTT98
// Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label: 23432
// One pair, where two cards share one label, and the other three cards have a different label from the pair and each other: A23A4
// High card, where all cards' labels are distinct: 23456

function getHigh(hand, points, cards) {
  let all = Object.entries(hand).sort((a, b) => b[1] - a[1]);
  const wildCards = "J" in hand ? hand["J"] : 0;
  let rank = 0;
  // Five of a kind
  if (all.length === 1 || (all.length === 2 && wildCards > 0)) {
    return [1, points, cards];
  }
  const highCard = all[0];
  const secondHigh = all[1];
  // 4 of a kind OR full house
  if (all.length === 2) {
    if (highCard[1] === 4) return [2, points, cards];
    return [3, points, cards];
  }
  if (highCard[1] === 1) {
    if (wildCards > 0) return [6, points, cards];
    else return [7, points, cards];
  }
  if (highCard[1] === 2) {
    if (secondHigh[1] === 2) {
      if (wildCards === 2) return [2, points, cards];
      if (wildCards === 1) return [3, points, cards];
      return [5, points, cards];
    }
    if (wildCards === 2) return [4, points, cards];
    if (wildCards === 1) return [4, points, cards];
    return [6, points, cards];
  }
  if (highCard[1] === 3) {
    if (wildCards === 1) return [2, points, cards];
    else return [4, points, cards];
  }
}

// All of this code is out of hand and needs to be rewritten.
// There are some edge cases it isn't handling properly, should probably just dump it and rewrite
// in a much nicer way. As it is its 'if statement hell'.
function getHighest(hand, points, cards) {
  let keys = Object.keys(hand);
  let vals = Object.values(hand);
  let all = Object.entries(hand).sort((a, b) => b[1] - a[1]);
  const wildCards = "J" in hand ? hand["J"] : 0;
  // console.log(all, "wilds:", wildCards);
  // five of a kind
  if (all.length === 1 || (all.length === 2 && wildCards > 0)) {
    // console.log("5 of a kind:", [1, points, cards]);
    return [1, points, cards];
  }
  const highCard = all[0];
  const secondHigh = all[1];
  // four of a kind or full house
  if (all.length === 2) {
    if (highCard[1] === 4) return [2, points, cards];
    // else its a full house
    return [3, points, cards];
  }
  if (cards === "JJ73K") {
    console.log("analyzing:", highCard, secondHigh, wildCards, all);
  }
  if (wildCards === 0) {
    if (highCard[1] === 3) return [4, points, cards];
    if (highCard[1] === 2 && secondHigh[1] === 2) return [5, points, cards];
    if (highCard[1] === 2) return [6, points, cards];
    if (highCard[1] === 1) return [7, points, cards];
  } else {
    // if (wildCards === 3) console.log("three wilds!", all);
    if (wildCards === 3) return [2, points, cards];
    if (highCard[1] === 3) return [2, points, cards];
    // if (highCard[1] === 2 && wildCards === 2) return [2, points, cards];
    if (highCard[1] === 2 && highCard[0] !== "J" && wildCards === 2)
      return [2, points, cards];
    if (
      highCard[1] === 2 &&
      highCard[0] === "J" &&
      wildCards === 2 &&
      secondHigh[1] === 2
    )
      return [2, points, cards];
    if (highCard[1] === 2 && highCard[0] === "J" && wildCards === 2)
      return [3, points, cards];
    if (highCard[1] === 2 && secondHigh[1] === 2) return [3, points, cards];
    if (highCard[1] === 2 && wildCards === 1) return [4, points, cards];
    console.log("check this!", all);
    // if (highCard[1] === 2) console.log("check wilds:", all);
    // if (highCard[1] === 2) return [3, points, cards];
    if (highCard[1] === 1) return [6, points, cards];
  }
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input
    .split("\n")
    .map((e) => e.trim().split(" "))
    .map((e) => [e[0], +e[1]]);
  const ranks = lines.length + 1;
  const hands = lines.map((e) => {
    const cards = e[0];
    const counts = cards
      .split("")
      .reduce((a, e) => (e in a ? a[e]++ : (a[e] = 1), a), {});
    return [counts, e[1], cards];
  });
  const order = [
    "A",
    "K",
    "Q",
    "T",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
    "J",
  ];
  const orderKey = order.reverse().reduce((a, e, i) => ((a[e] = i), a), {});
  console.log("key:", orderKey);
  const bestHands = hands.map(([hand, points, cards]) => {
    // let test = getHighest(hand, points, cards);
    let test = getHigh(hand, points, cards);
    return test;
  });
  let sorted = bestHands.sort((a, b) => {
    if (a[0] - b[0] === 0) {
      if (a[2] === "JJ73K" || b[2] === "JJ73K") {
        console.log("FIGURE THIS OUT:", a, b);
      }
      let handA = a[2];
      let handB = b[2];
      for (let i = 0; i < 5; i++) {
        if (handA[i] == handB[i]) continue;
        let aVal = orderKey[handA[i]];
        let bVal = orderKey[handB[i]];
        return aVal - bVal;
      }
    } else return b[0] - a[0];
  });
  let scored = sorted.map(([num, points, cards], i) => {
    return [i + 1, num, points, cards];
  });
  let justCards = scored.map(([score, num, points, cards]) => cards);
  // console.dir(justCards, { maxArrayLength: null });
  // console.log("sorted:", scored);
  return scored.reduce((a, e) => a + e[2] * e[0], 0);
};

run({
  part1: {
    tests: [
      {
        input: `
          32T3K 765
          T55J5 684
          KK677 28
          KTJJT 220
          QQQJA 483
        `,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          32T3K 765
          T55J5 684
          KK677 28
          KTJJT 220
          QQQJA 483
        `,
        expected: 5905,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
