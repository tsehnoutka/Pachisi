// TODO:

var redLocations = [0, 0, 0, 0]; //  these will be the indexes in to the array below of the 4 red pieces
var greenLocations = [0, 0, 0, 0]; //  these will be the indexes in to the array below of the 4 green pieces
var blueLocations = [0, 0, 0, 0]; //  these will be the indexes in to the array below of the 4 blue pieces
var yellowLocations = [0, 0, 0, 0]; //  these will be the indexes in to the array below of the 4 yellow pieces
const board = [
  //  red section
  "B8", "C8", "D8", "E8", "F8", "G8", "H8", "I8", "I9",
  "B9", "C9", "D9", "E9", "F9", "G9", "H9", //red home
  "IA", "HA", "GA", "FA", "EA", "DA", "CA", "BA",
  //  green section
  "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "9I",
  "9B", "9C", "9D", "9E", "9F", "9G", "9H", // green home
  "8I", "8H", "8G", "8F", "8E", "8D", "8C", "8B",
  //  blue section
  "7A", "6A", "5A", "4A", "3A", "2A", "1A", "0A", "09",
  "79", "69", "59", "49", "39", "29", "19", // blue home
  "08", "18", "28", "38", "48", "58", "68", "78",
  //  yellow section
  "87", "86", "85", "84", "83", "82", "81", "80", "90",
  "97", "96", "95", "94", "93", "92", "91", //  yellow home
  "A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"
];
//  Variables
const playerInfo = [{
    color: "red",
    file: "img/playingPieceRed.png",
    locations: [0, 0, 0, 0] //  these will be the indexes in to the board array below of the 4 red pieces
  },
  {
    color: "blue",
    file: "img/playingPieceBlue.png",
    locations: [0, 0, 0, 0] //  these will be the indexes in to the board array below of the 4 green pieces
  },
  {
    color: "green",
    file: "img/playingPieceGreen.png",
    locations: [0, 0, 0, 0] //  these will be the indexes in to the board array below of the 4 blue pieces
  },
  {
    color: "yellow",
    file: "img/playingPieceYellow.png",
    locations: [0, 0, 0, 0] //  these will be the indexes in to the board array of the 4 yellow pieces
  },
]

const NUM_OF_DICE = 2;
const DICE_FACES = ["img/woodgrainDot1.png",
  "img/woodgrainDot3.png",
  "img/woodgrainDot4.png",
  "img/woodgrainDot6.png"
];
const PLAYER_RED = 0;
const PLAYER_GREEN = 1;
const PLAYER_BLUE = 2;
const PLAYER_YELLOW = 3;
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
playerInfo[PLAYER_RED].locations[0] = 0;
var previousSquare = "";
var moveType = true; //  true to lift peice, false to place piece
var tmpMovePiece = "";
var outputMessage = "";
var displayMessage = false;



jQuery(document).ready(function($) {
  //  create the event handlers for each box of the game
  console.log("about to create events");
  for (x = 0; x < board.length; x++) {
    let tmpId = board[x]
    let tempBtn = $("#" + tmpId);
    tempBtn.on("click", function(event) {
      makeMove(tmpId, moveType);
      if (displayMessage)
        alert(outputMessage);
      displayMessage = false;
    }); //  end of creating click function
  } //  end of for x
}); //  end document ready function

function is_iPhone_or_iPod() {
  return navigator.platform.match(/iPad/i) ||
    navigator.platform.match(/iPhone/i) ||
    navigator.platform.match(/MacIntel/i)
}

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





function makeMove(id, lift) {
  console.log("square: " + id + " lift?" + lift);


  let imgID = "i" + id;
  let tmpImage = document.getElementById(imgID).src
  if (lift) {
    if (tmpImage.split('/').pop() !== "") {
      let a = tmpImage.split('/');
      tempSquare = a[3] + "/" + a[4];
      document.getElementById(imgID).src = "";
    } else {
      outputMessage = "Please select a valid space";
      displayMessage = true;
    }
    moveType = false;
  } else {
    document.getElementById(imgID).src = tempSquare;
    moveType = true;
  }

  if (turn == 3)
    turn = -1;
  if (!lift)
  TURNBOX.style.backgroundColor = playerInfo[++turn].color;
}

/*******************************************************************************
 **   testing functions
 *******************************************************************************/
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
  //togglePeices();

  let tempSquare = "";
  let image1 = document.getElementById("i" + board[playerInfo[PLAYER_RED].locations[0]]); //red
  if (image1.src.split('/').pop() !== "") {
    let a = image1.src.split('/');
    tempSquare = a[3] + "/" + a[4];
  } else {
    tempSquare = "";
  }

  image1.src = "img/playingPieceRed.png"; //  move to that tmpSquare
  //  set previous square to what it was
  if (playerInfo[PLAYER_RED].locations[0] != 0)
    document.getElementById("i" + board[playerInfo[PLAYER_RED].locations[0] - 1]).src = previousSquare;

  previousSquare = tempSquare;
  if (playerInfo[PLAYER_RED].locations[0] == 95)
    playerInfo[PLAYER_RED].locations[0] = 0;
  else
    playerInfo[PLAYER_RED].locations[0] += 1;

  if (turn > 3)
    turn = 0;
  TURNBOX.style.backgroundColor = playerInfo[turn++].color;

}
BTN_TEST.addEventListener("click", testMoves, false);
