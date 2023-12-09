// const fs = require("fs");
import fs from "fs";

// const example = fs.readFileSync("./example.txt", "utf8");
const input = fs.readFileSync("./input.txt", "utf8");
// const lxsterEx = fs.readFileSync("./lxsterExample.txt", "utf8");

// console.log(part2(lxsterEx));

const startTime = performance.now();
// console.log("part 1 ex:", part1(example));
// console.log("part 1 in:", part1(input));
// console.log("part 2 ex:", part2(example));
console.log("part 2 in:", part2(input));
console.log(`time to complete: ${performance.now() - startTime}ms`);

function part1(input) {
  const games = parseInput(input);
  const sortedGames = sortGames(games);
  return getMultipliedBetSum(sortedGames);
}

function part2(input) {
  const games = parseInput(input);
  const sortedGames = sortGamesJokerRule(games);
  let hands = sortedGames.map((e) => e.hand);
  console.dir(hands, { maxArrayLength: null });
  return getMultipliedBetSum(sortedGames);
}

function findHighestWeightWithJokerRule(hand) {
  const cardOptions = getCardOptions();

  let jokerCount = 0;
  let jokerLocations = [];
  for (let i = 0; i < hand.length; i++) {
    if (hand[i] === "J") {
      jokerCount++;
      jokerLocations.push(i);
    }
  }

  if (jokerCount === 0) {
    return getHandWeight(hand);
  }

  let maxWeight = 0;
  const loopCount = cardOptions.length ** jokerCount;
  for (let i = 0; i <= loopCount; i++) {
    let checkHand;

    const shift1 = i;
    const shift2 = shift1 % cardOptions.length;
    const shift3 = shift2 % cardOptions.length;

    if (jokerCount === 1) {
      checkHand = hand.split("");
      checkHand[jokerLocations[0]] = cardOptions[shift1];
      checkHand = checkHand.join("");
    }

    if (jokerCount === 2) {
      checkHand = hand.split("");
      checkHand[jokerLocations[0]] = cardOptions[shift2];
      checkHand[jokerLocations[1]] = cardOptions[shift1];
      checkHand = checkHand.join("");
    }

    if (jokerCount === 3) {
      checkHand = hand.split("");
      checkHand[jokerLocations[0]] = cardOptions[shift3];
      checkHand[jokerLocations[1]] = cardOptions[shift2];
      checkHand[jokerLocations[2]] = cardOptions[shift1];
      checkHand = checkHand.join("");
    }

    if (jokerCount === 5 || jokerCount === 4) {
      maxWeight = 7;
      break;
    }

    const currentWeight = getHandWeight(checkHand);
    maxWeight = Math.max(currentWeight, maxWeight);

    if (maxWeight === 7) {
      break;
    }
  }
  return maxWeight;
}

function getMultipliedBetSum(sortedGames) {
  let rank = 1;
  let res = 0;
  for (let game of sortedGames) {
    res += game.bet * rank;
    rank++;
  }
  return res;
}

function sortGames(games) {
  return games.sort((game1, game2) => {
    if (hand1IsWinner(game1.hand, game2.hand)) {
      return 1;
    } else if (hand1IsWinner(game2.hand, game1.hand)) {
      return -1;
    } else {
      return 0;
    }
  });
}

function sortGamesJokerRule(games) {
  return games.sort((game1, game2) => {
    if (hand1IsWinnerJokerRule(game1.hand, game2.hand)) {
      return 1;
    } else if (hand1IsWinnerJokerRule(game2.hand, game1.hand)) {
      return -1;
    } else {
      return 0;
    }
  });
}

function hand1IsWinnerJokerRule(hand1, hand2) {
  const hand1Weight = findHighestWeightWithJokerRule(hand1);
  const hand2Weight = findHighestWeightWithJokerRule(hand2);

  if (hand1Weight === hand2Weight) {
    return handleSameType(hand1, hand2, true);
  } else {
    return hand1Weight > hand2Weight;
  }
}

function hand1IsWinner(hand1, hand2) {
  const hand1Weight = getHandWeight(hand1);
  const hand2Weight = getHandWeight(hand2);

  if (hand1Weight === hand2Weight) {
    return handleSameType(hand1, hand2, false);
  } else {
    return hand1Weight > hand2Weight;
  }
}

function handleSameType(hand1, hand2, joker) {
  const cardWeights = getCardWeights(joker);
  for (let i = 0; i < hand1.length; i++) {
    const check1 = hand1[i];
    const check2 = hand2[i];
    const hand1Wins = cardWeights[check1] > cardWeights[check2];
    const hand2Wins = cardWeights[check1] < cardWeights[check2];
    if (hand1Wins) {
      return true;
    } else if (hand2Wins) {
      return false;
    }
  }
  // it's the same hand
  return true;
}

function getHandWeight(hand) {
  const counts = getCardCounts(hand);
  switch (true) {
    case isFiveOfAKind(counts):
      return 7;
    case isFourOfAKind(counts):
      return 6;
    case isFullHouse(counts):
      return 5;
    case isThreeOfAkind(counts):
      return 4;
    case isTwoPair(counts):
      return 3;
    case isOnePair(counts):
      return 2;
    case isHighCard(counts):
      return 1;
  }
}

function getCardCounts(hand) {
  let counts = {};
  for (let card of hand) {
    if (!counts[card]) {
      counts[card] = 1;
      continue;
    }
    counts[card]++;
  }
  return counts;
}

function isHighCard(counts) {
  for (let key in counts) {
    if (counts[key] > 1) {
      return false;
    }
  }
  return true;
}

function isOnePair(counts) {
  let pairsCount = 0;
  for (let key in counts) {
    if (counts[key] === 2) {
      pairsCount++;
    }
  }
  return pairsCount === 1;
}

function isTwoPair(counts) {
  let pairsCount = 0;
  for (let key in counts) {
    if (counts[key] === 2) {
      pairsCount++;
    }
  }
  return pairsCount === 2;
}

function isFullHouse(counts) {
  let roof = false;
  let base = false;
  for (let key in counts) {
    if (counts[key] === 2) {
      roof = true;
    }
    if (counts[key] === 3) {
      base = true;
    }
  }
  return roof && base;
}

function isThreeOfAkind(counts) {
  if (isFullHouse(counts)) {
    return false;
  }
  for (let key in counts) {
    if (counts[key] === 3) {
      return true;
    }
  }
  return false;
}

function isFourOfAKind(counts) {
  for (let key in counts) {
    if (counts[key] === 4) {
      return true;
    }
  }
  return false;
}

function isFiveOfAKind(counts) {
  for (let key in counts) {
    if (counts[key] === 5) {
      return true;
    }
  }
  return false;
}

function parseInput(input) {
  const gameObjects = [];
  const lines = input.split("\n").filter((a) => a !== "");
  lines.map((line) => {
    let [hand, bet] = line.split(" ");
    bet = Number(bet);
    gameObjects.push({ hand, bet });
  });
  return gameObjects;
}

function getCardWeights(joker) {
  let cardWeights;
  if (!joker) {
    cardWeights = {
      2: 1,
      3: 2,
      4: 3,
      5: 4,
      6: 5,
      7: 6,
      8: 7,
      9: 8,
      T: 9,
      J: 10,
      Q: 11,
      K: 12,
      A: 13,
    };
  } else {
    cardWeights = {
      2: 1,
      3: 2,
      4: 3,
      5: 4,
      6: 5,
      7: 6,
      8: 7,
      9: 8,
      T: 9,
      J: 0,
      Q: 11,
      K: 12,
      A: 13,
    };
  }

  return cardWeights;
}

function getCardOptions() {
  return ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
}
