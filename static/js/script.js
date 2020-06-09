function ageInDays() {
  var ageInYear = prompt("What was your birth year?");
  var age = (2020 - ageInYear) * 365;
  var h1 = document.createElement("h1");
  var textAnswer = document.createTextNode("You are " + age + " Days old");
  h1.setAttribute("id", "ages");
  h1.appendChild(textAnswer);
  document.getElementById("flex-box-result").appendChild(h1);
  //document.getElementById('ages').innerHTML = "You are " + age + " Days old";
}

function reset() {
  document.getElementById("ages").remove();
}

// 1 = rock
// 2 = paper
// 3 = scissor

function rps(myChoice) {
  var botMove = Math.floor(Math.random() * 3) + 1;

  if (myChoice == 1) {
    if (botMove == 1) {
      rpsFrontEnd(myChoice, botMove, "Tied");
      //draw
    } else if (botMove == 2) {
      rpsFrontEnd(myChoice, botMove, "Bot Win");
      //bot win
    } else {
      rpsFrontEnd(myChoice, botMove, "You Win");
      // i win
    }
  } else if (myChoice == 2) {
    if (botMove == 1) {
      rpsFrontEnd(myChoice, botMove, "You Win");
      //i win
    } else if (botMove == 2) {
      rpsFrontEnd(myChoice, botMove, "Tied");
      //draw
    } else {
      rpsFrontEnd(myChoice, botMove, "Bot Win");
      // bot win
    }
  } else if (myChoice == 3) {
    if (botMove == 1) {
      rpsFrontEnd(myChoice, botMove, "Bot Win");
      //bot win
    } else if (botMove == 2) {
      rpsFrontEnd(myChoice, botMove, "You Win");
      //i wni
    } else {
      rpsFrontEnd(myChoice, botMove, "Tied");
      // draw
    }
  }
}

function rpsFrontEnd(myChoice, botChoice, message) {
  var imageDatabase = {
    "1": document.getElementById("rock").src,
    "2": document.getElementById("paper").src,
    "3": document.getElementById("scissor").src,
  };

  var textColor = {
    "You Win": "green",
    Tied: "yellow",
    "Bot Win": "red",
  };

  document.getElementById("rock").remove();
  document.getElementById("paper").remove();
  document.getElementById("scissor").remove();

  var myChoiceDiv = document.createElement("div");
  var botChoiceDiv = document.createElement("div");
  var messageDiv = document.createElement("div");
  var label1 = document.createElement("h3");
  var label2 = document.createElement("h3");
  var reloadButton = document.createElement("div");

  label1.innerHTML = "You";
  label2.innerHTML = "Bot";
  reloadButton.innerHTML =
    "<span><button class='btn btn-danger' onclick='reloadPage()'>Reload</button></span>";

  myChoiceDiv.innerHTML = "<img src='" + imageDatabase[myChoice] + "'>";
  myChoiceDiv.appendChild(label1);

  botChoiceDiv.innerHTML = "<img src='" + imageDatabase[botChoice] + "'>";
  botChoiceDiv.appendChild(label2);

  messageDiv.innerHTML =
    "<h1 style=' color:" +
    textColor[message] +
    ";  font-size:60px; padding:30px; margin:auto;'>" +
    message +
    "<h1>";
  messageDiv.appendChild(reloadButton);

  document.getElementById("flex-box-rps-div").appendChild(myChoiceDiv);
  document.getElementById("flex-box-rps-div").appendChild(messageDiv);
  document.getElementById("flex-box-rps-div").appendChild(botChoiceDiv);
}

function reloadPage() {
  //console.log(imageDatabase);
  location.reload();
}

//blackjack game

let blackjackGame = {
  you: { scoreSpan: "your-blackjack-result", div: "your-box", score: 0 },
  dealer: { scoreSpan: "dealer-blackjack-result", div: "dealer-box", score: 0 },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "K", "Q", "A"],
  cardsMap: {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    J: 10,
    K: 10,
    Q: 10,
    A: [1, 11],
  },
  wins: 0,
  looses: 0,
  draws: 0,
  isStand: false,
  isTurnOver: false,
};

const YOU = blackjackGame["you"];
const DEALER = blackjackGame["dealer"];
const hitSound = new Audio("static/sound/woosh.mp3");
const winSound = new Audio("static/sound/cash register.mp3");
const looseSound = new Audio("static/sound/aww.mp3");

// document.querySelector('#blackjack-hit-button').addEventListener('click' , blackjackHit);

function blackjackHit() {
  if (blackjackGame["isStand"] === false) {
    let card = randomCard();
    showCard(YOU, card);
    updateScore(card, YOU);
    showScore(YOU);
    //showCard(DEALER );
  }
}

function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame["cards"][randomIndex];
}

function blackjackDeal() {
  if (blackjackGame["isTurnOver"] === true) {
    let yourImage = document
      .querySelector("#" + YOU["div"])
      .querySelectorAll("img");
    let dealerImage = document
      .querySelector("#" + DEALER["div"])
      .querySelectorAll("img");

    for (let i = 0; i < yourImage.length; i++) {
      yourImage[i].remove();
    }

    for (let i = 0; i < dealerImage.length; i++) {
      dealerImage[i].remove();
    }

    YOU["score"] = DEALER["score"] = 0;
    showScore(YOU);
    showScore(DEALER);
    document.querySelector("#" + YOU["scoreSpan"]).style.color = "white";
    document.querySelector("#" + DEALER["scoreSpan"]).style.color = "white";
    document.querySelector("#blackjack-result").textContent = "Let's Play!";
    document.querySelector("#blackjack-result").style.color = "Black";

    blackjackGame["isStand"] = blackjackGame["isTurnOver"] = false;
  }
}

async function blackjackStand() {
  blackjackGame["isStand"] = true;

  while (DEALER["score"] < 16 && blackjackGame["isStand"] === true) {
    let card = randomCard();
    showCard(DEALER, card);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(1000);
  }

  blackjackGame["isTurnOver"] = true;
  showResult(computeWinner());
}

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve,ms));
}

function showCard(activePlayer, card) {
  if (activePlayer["score"] <= 21) {
    let cardImage = document.createElement("img");
    cardImage.src = "static/image/" + card + ".png";
    hitSound.play();
    document.getElementById(activePlayer["div"]).appendChild(cardImage);
  } else {
  }
}

function updateScore(card, activePlayer) {
  if (card === "A") {
    if (activePlayer["score"] + blackjackGame["cardsMap"][card][1] <= 21) {
      activePlayer["score"] += blackjackGame["cardsMap"][card][1];
    } else {
      activePlayer["score"] += blackjackGame["cardsMap"][card][0];
    }
  } else {
    activePlayer["score"] += blackjackGame["cardsMap"][card];
  }
}

function showScore(activePlayer) {
  if (activePlayer["score"] > 21) {
    document.querySelector("#" + activePlayer["scoreSpan"]).textContent =
      "Bust";
    document.querySelector("#" + activePlayer["scoreSpan"]).style.color = "red";
  } else {
    document.querySelector("#" + activePlayer["scoreSpan"]).textContent =
      activePlayer["score"];
  }
}

function computeWinner() {
  let winner;

  if (YOU["score"] <= 21 && DEALER["score"] > 21) {
    winner = YOU;
    blackjackGame["wins"]++;
    console.log("You won");
  } else if (YOU["score"] <= 21 && YOU["score"] > DEALER["score"]) {
    winner = YOU;
    blackjackGame["wins"]++;
    console.log("You won");
  } else if (YOU["score"] <= 21 && YOU["score"] < DEALER["score"]) {
    winner = DEALER;
    blackjackGame["looses"]++;
    console.log("You loose");
  } else if (YOU["score"] <= 21 && YOU["score"] === DEALER["score"]) {
    //draw
    blackjackGame["draws"]++;
    console.log("You drew");
  } else if (YOU["score"] > 21 && YOU["score"] < DEALER["score"]) {
    winner = DEALER;
    blackjackGame["looses"]++;
    console.log("You loose");
  } else if (YOU["score"] > 21 && DEALER["score"] > 21) {
    //draw
    blackjackGame["draws"]++;
    console.log("You drew");
  }

  return winner;
}

function showResult(winner) {
  let message, messageColor;

  if (blackjackGame["isTurnOver"] === true) {
    if (winner === YOU) {
      message = "You won!";
      messageColor = "green";
      winSound.play();
    } else if (winner === DEALER) {
      message = "You loose";
      messageColor = "red";
      looseSound.play();
    } else {
      message = "You Drew";
      messageColor = "yellow";
    }

    document.querySelector("#blackjack-result").textContent = message;
    document.querySelector("#blackjack-result").style.color = messageColor;

    document.querySelector("#wins").textContent = blackjackGame["wins"];
    document.querySelector("#looses").textContent = blackjackGame["looses"];
    document.querySelector("#draws").textContent = blackjackGame["draws"];
  }
}
