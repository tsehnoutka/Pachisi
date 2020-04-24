// TODO:

var redLocations = [0, 0, 0, 0]; //  these will be the indexes in to teh array below
const redMoves = ["B9", "C9", "D9", "E9", "F9", "G9", "H9", "I9",
  "IA", "HA", "GA", "FA", "EA", "DA", "CA", "BA",
  "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI",
  "9I", "8I", "8H", "8G", "8F", "8E", "8D", "8C", "8B",
  "7A", "6A", "5A", "4A", "3A", "2A", "1A", "0A",
  "09", "08", "18", "28", "38", "48", "58", "68", "78",
  "87", "86", "85", "84", "83", "82", "81", "80",
  "90", "A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7",
  "B8", "C8", "D8", "E8", "F8", "G8", "H8", "I8",
  "I9", "H9", "G9", "F9", "E9", "D9", "C9", "B9"
];
//  Variables
const playerInfo = [{
    number: 0,
    color: "red",
    file: "img/playingPieceRed.png"
  },
  {
    number: 1,
    color: "blue",
    file: "img/playingPieceBlue.png"
  },
  {
    number: 2,
    color: "green",
    file: "img/playingPieceGreen.png"
  },
  {
    number: 3,
    color: "yellow",
    file: "img/playingPieceYellow.png"
  },
]

const NUM_OF_DICE = 2;
const DICE_FACES = ["img/woodgrainDot1.png",
  "img/woodgrainDot3.png",
  "img/woodgrainDot4.png",
  "img/woodgrainDot6.png"
];
const BTN_THROW = document.getElementById("throw");
const BTN_TEST = document.getElementById("test");
const TXT_VALUE = document.getElementById("value");
const TURNBOX = document.getElementById("turnbox");
const START_RED = document.getElementById("Red");
const START_BLUE = document.getElementById("Blue");
const START_GREEN = document.getElementById("Green");
const START_YELLOW = document.getElementById("Yellow");

var diceValue = [1, 3, 4, 6]
var diceRoll = [0, 0];
var turn = 0;
var test = true;
redLocations[0] = 0;
var previousSquare = "";

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function RedStartClicked() {
  console.log("Red Start clicked")
}
START_RED.addEventListener("click", RedStartClicked, false);

function throwDice() {
  console.log("throwing shells");

  for (x = 0; x < NUM_OF_DICE; x++) {
    let id = "d" + (x + 1);
    let spin = Math.floor(Math.random() * 4);
    //console.log("spin is: " + spin);
    document.getElementById(id).src = DICE_FACES[spin];
    diceRoll[x] = diceValue[spin];
  } //  end for
  value = diceRoll[0] + " + " + diceRoll[1] + " : " + (diceRoll[0] + diceRoll[1]);
  TXT_VALUE.value = value;
}
BTN_THROW.addEventListener("click", throwDice, false);



function togglePeices() {
  test = (test ^ true) ? true : false;
  let image2 = document.getElementById("i" + "97"); //Yellow
  let image3 = document.getElementById("i" + "9B"); // green
  let image4 = document.getElementById("i" + "79"); // blue
  if (test) {
    image2.src = "img/playingPieceYellow.png";
    image3.src = "img/playingPieceGreen.png";
    image4.src = "img/playingPieceBlue.png";
  } else {
    image2.src = "";
    image3.src = "";
    image4.src = "";
  }
}

function testMoves() {
  console.log("test movement");
  throwDice()
  togglePeices();
  let tempSquare = "";
  let image1 = document.getElementById("i" + redMoves[redLocations[0]]); //red
  if (image1.src.split('/').pop() !== "") {
    let a = image1.src.split('/');
    tempSquare = a[3] + "/" + a[4];
  } else {
    tempSquare = "";
  }

  image1.src = "img/playingPieceRed.png"; //  move to that tmpSquare
  //  set previous square to what it was
  if (redLocations[0] != 0) {
    document.getElementById("i" + redMoves[redLocations[0] - 1]).src = previousSquare;
  }
  previousSquare = tempSquare;
  redLocations[0] += 1;

  if (turn > 3)
    turn = 0;
  TURNBOX.style.backgroundColor = playerInfo[turn++].color;
}
BTN_TEST.addEventListener("click", testMoves, false);
