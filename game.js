/* TODO:
 - How do I move a piece onto the board
 - How to manage turn when player moves two pieces instead of one
 - prevent wrong color in belly
 - lift one of the two peices from  a square
 - doublet
 - right now I HAVE to have 4 players
 - fix table layout  (HTML5 doesnt alow: <table> <table>)
 - I don't handle if two or more players roll the same number when trying to figure out who shoudl go first
 - need to make sure a player can't place e a piece where there is already two of their peices
*/
const board = [
  //  red section
  "B8", "C8", "D8", "E8", "F8", "G8", "H8", "I8", "I9",
  "B9", "C9", "D9", "E9", "F9", "G9", "H9", //red belly
  "IA", "HA", "GA", "FA", "EA", "DA", "CA", "BA",
  //  green section
  "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "9I",
  "9B", "9C", "9D", "9E", "9F", "9G", "9H", // green belly
  "8I", "8H", "8G", "8F", "8E", "8D", "8C", "8B",
  //  blue section
  "7A", "6A", "5A", "4A", "3A", "2A", "1A", "0A", "09",
  "79", "69", "59", "49", "39", "29", "19", // blue belly
  "08", "18", "28", "38", "48", "58", "68", "78",
  //  yellow section
  "87", "86", "85", "84", "83", "82", "81", "80", "90",
  "97", "96", "95", "94", "93", "92", "91", //  yellow belly
  "A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"
];
//  Variables
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
const HOME_RED = document.getElementById("Red");
const HOME_GREEN = document.getElementById("Green");
const HOME_BLUE = document.getElementById("Blue");
const HOME_YELLOW = document.getElementById("Yellow");
const NUM_OF_PIECES = 4;
const BTN_THROW = document.getElementById("throw");
const BTN_TEST = document.getElementById("test");
const TXT_VALUE = document.getElementById("value");
const TURNBOX = document.getElementById("turnbox");
const playerInfo = [{
    color: "red",
    pieceFile: "img/playingPieceRed.png",
    startID: "sRed",
    homeFile: "img/RedStart.png",
    locations: [19, 19, 15, 14], //  these will be the indexes in to the board array below of the 4 red pieces
    start: 0,
    home: HOME_RED
  },
  {
    color: "green",
    pieceFile: "img/playingPieceGreen.png",
    startID: "sGrn",
    homeFile: "img/GreenStart.png",
    locations: [43, 43, 39, 38], //  these will be the indexes in to the board array below of the 4 blue pieces
    start: 0,
    home: HOME_GREEN
  },
  {
    color: "blue",
    pieceFile: "img/playingPieceBlue.png",
    startID: "sBlu",
    homeFile: "img/BlueStart.png",
    locations: [67, 67, 62, 63], //  these will be the indexes in to the board array below of the 4 green pieces
    start: 0,
    home: HOME_BLUE
  },
  {
    color: "yellow",
    pieceFile: "img/playingPieceYellow.png",
    startID: "sYel",
    homeFile: "img/YellowStart.png",
    locations: [91, 91, 87, 86], //  these will be the indexes in to the board array of the 4 yellow pieces
    start: 0,
    home: HOME_YELLOW
  },
];

var diceValue = [1, 3, 4, 6]
var diceRoll = [0, 0];
var turn = 0;
var test = true;
var previousSquare = "";
var moveType = true; //  true to lift peice, false to place piece
var tmpMovePiece = "";
var outputMessage = "";
var displayMessage = false;
var movingPiecePos = -1; //  the index intor the player's location of the peice that is moving
var doublet = false;



jQuery(document).ready(function($) {
  //  create the event handlers for each box of the game
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


  //  have each player roll dice and see who starts first
  let largestRoll = -1;
  turn = 0;
  for (let x = 0; x < NUM_OF_PIECES; x++) {
    let roll = throwDice();
    if (roll > largestRoll) {
      largestRoll = roll;
      turn = x;
    }
  }
  //let message = playerInfo[turn].color + " goes first";
  //console.log(message);
  //alert(message);
  turn = -1; //  forcing the turn to be red for testing
  flipTurnIndicator();
}); //  end document ready function

/************************************************
 **           is iPhone or iPad
 ************************************************/
function is_iPhone_or_iPod() {
  return navigator.platform.match(/iPad/i) ||
    navigator.platform.match(/iPhone/i) ||
    navigator.platform.match(/MacIntel/i)
}

/************************************************
 **           sleep
 ************************************************/
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

/************************************************
 **         flip turn indicator
 ************************************************/
function flipTurnIndicator() {
  if (turn == 3)
    turn = -1;
  TURNBOX.style.backgroundColor = playerInfo[++turn].color;
}

/************************************************
 **            add Number To File
 ************************************************/
function addNumberToFile(fileName, n) {
  let splitString = fileName.split('.');
  return splitString[0] + n + "." + splitString[1];
}

/*******************************************************************************
 **                         Throw Dice
 *******************************************************************************/
function throwDice() {
  doublet = false;

  for (let x = 0; x < NUM_OF_DICE; x++) {
    let id = "d" + (x + 1);
    let spin = Math.floor(Math.random() * 4);
    //console.log("spin is: " + spin);
    document.getElementById(id).src = DICE_FACES[spin];
    diceRoll[x] = diceValue[spin];
  } //  end for
  if (diceRoll[0] == diceRoll[1]) {
    doublet = true;
    console.log("rolled a doublet!");
  }
  value = diceRoll[0] + " + " + diceRoll[1] + " : " + (diceRoll[0] + diceRoll[1]);
  TXT_VALUE.value = value;
  return diceRoll[0] + diceRoll[1];
}
BTN_THROW.addEventListener("click", throwDice, false);


/*******************************************************************************
 **                        update Start / Home
 *******************************************************************************/
function updateStartHome() {
  for (let p = 0; p < 4; p++) { //  number of players
    let player = playerInfo[p];
    let startCount = 0;
    let homeCount = 0;
    for (let i = 0; i < 4; i++) {
      if (player.locations[i] == -1)
        startCount++;
      if (player.locations[i] == 100)
        homeCount++
    } //  end for indexes
    if (homeCount > 0)
      player.home.src = addNumberToFile(player.homeFile, homeCount);
    for (let s = 1; s <= startCount; s++) {
      let newString = player.startID + s;
      let homePip = document.getElementById(newString);
      homePip.style.backgroundColor = player.color;
    }
  } // end for number of players
} //  end of updateStartHome

/*******************************************************************************
 **                         Make Move
 *******************************************************************************/
function makeMove(id, lift) {
  //  check to see if this piece belongs to the color that is moving
  //  go through that color's locations array
  //  also need to check if the clicked square contains a piece.  this can be determined by going through the array
  //get the index of the id in board,  get the index of that in the player Info.locations array
  let boardPos = board.indexOf(id);
  console.log("square ID/boardPos: " + id + "/" + boardPos + ((lift == true) ? " - Lifting" : " - Placing"));
  let imgID = "i" + id;
  let tmpImage = document.getElementById(imgID).src //  get the image on the clicked square

  //  if player is picking up piece....
  if (lift) {
    movingPiecePos = playerInfo[turn].locations.indexOf(boardPos);
    if (movingPiecePos == -1) { //  is it THIS player's turn  ??
      alert("NOT your turn !!");
      return;
    }

    if (tmpImage.split('/').pop() !== "") { //  if there is a piece on the board
      //  need to check if I am moving a piece from a square that has two pieces on it
      let found2 = tmpImage.indexOf("2.png");
      tempSquare = playerInfo[turn].pieceFile;
      if (found2 != -1)
        document.getElementById(imgID).src = tempSquare;
      else
        document.getElementById(imgID).src = "";

    } else {
      outputMessage = "Please select a valid space";
      displayMessage = true;
    }
    moveType = false;
  } //  of of ligting a piece

  //  if player is placing piece on board
  else {
    let p = 0; //  the player currently in that position
    let found = false;

    //  is there a piece the player is moving to ???
    while (p < NUM_OF_PIECES && !found) {
      let pieceIndex = playerInfo[p].locations.indexOf(boardPos);
      if (-1 != pieceIndex)
        found = true;
      else
        p++;
    } //  end while
    if (found) { //  there WAS a piece on the board
      //  what color?
      if (turn == p) { //  same color as player
        let twoDots = addNumberToFile(playerInfo[p].pieceFile, 2);
        document.getElementById(imgID).src = twoDots;
      } else { //  Not the same color
        let otherPlayer = -1;
        if (-1 != tmpImage.indexOf("Red"))
          otherPlayer = PLAYER_RED;
        if (-1 != tmpImage.indexOf("Green"))
          otherPlayer = PLAYER_GREEN;
        if (-1 != tmpImage.indexOf("Blue"))
          otherPlayer = PLAYER_BLUE;
        if (-1 != tmpImage.indexOf("Yellow"))
          otherPlayer = PLAYER_YELLOW;

        let pieceIndex = playerInfo[otherPlayer].locations.indexOf(boardPos);
        playerInfo[otherPlayer].locations[pieceIndex] = -1; //  send the peice back to Home
        document.getElementById(imgID).src = tempSquare;
      }
    } //  end if found
    else { //  no piece on board
      document.getElementById(imgID).src = tempSquare;
    }
    moveType = true;
    playerInfo[turn].locations[movingPiecePos] = boardPos; // place the piece
    movingPiecePos = -1;
    //  if the player is placing a piece, then change whose turn it is
    flipTurnIndicator();
    updateStartHome();
  } //  end of placing a peice
}

/*******************************************************************************
 **   testing functions
 *******************************************************************************/
function testMoves() {
  console.log("test movement");
  throwDice()

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
