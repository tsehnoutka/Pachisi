// TODO:


//  Variables
const PLAYER_RED  = 0;
const PLAYER_BLUE = 1;
const PLAYER_GREEN = 2;
const PLAYER_YELLOW = 3;
const PLAYER_RED_COLOR = "red";
const PLAYER_BLUE_COLOR = "blue";
const PLAYER_GREEN_COLOR = "green";
const PLAYER_YELLOW_COLOR = "yellow";
const PLAYER_RED_FILE = "img/playingPieceRed.png";
const PLAYER_BLUE_FILE = "img/playingPieceBlue.png";
const PLAYER_GREEN_FILE = "img/playingPieceGreen.png";
const PLAYER_YELLOW_FILE = "img/playingPieceYellow.png";

const NUM_OF_DICE = 2;
const DICE_FACES = ["img/woodgrainDot1.png",
  "img/woodgrainDot3.png",
  "img/woodgrainDot4.png",
  "img/woodgrainDot6.png"
];
const BTN_THROW = document.getElementById("throw");
const TXT_VALUE = document.getElementById("value");
const START_RED = document.getElementById("Red");
const START_BLUE = document.getElementById("Blue");
const START_GREEN = document.getElementById("Green");
const START_YELLOW = document.getElementById("Yellow");

var diceValue = [1, 3, 4, 6]
var diceRoll = [0, 0];


function RedStartClicked() {
  console.log("Red Start clicked")
}
START_RED.addEventListener("click", RedStartClicked, false);




function throwDice() {
  console.log("throwing shells")
  for (x = 0; x < NUM_OF_DICE; x++) {
    let id = "d" + (x + 1);
    let spin = Math.floor(Math.random() * 4);
    console.log("spin is: " + spin);
    document.getElementById(id).src = DICE_FACES[spin];
    diceRoll[x] = diceValue[spin];
  } //  end for
  value = diceRoll[0] + " + " + diceRoll[1];
  TXT_VALUE.value = value;
}
BTN_THROW.addEventListener("click", throwDice, false);
