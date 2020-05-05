/* TODO:
 - How to manage turn when player moves two pieces instead of one
 - doublet ( move a pair)
 - right now I HAVE to have 4 players
 - fix table layout  (HTML5 doesnt alow: <table> <table>)
 - I don't handle if two or more players roll the same number when trying to figure out who shoudl go first
 - set an emul for moveType ( LIFT, PLACE)  ( amd maybe for game tpye too)
 - put all the interface stuff in game, not client.  Client.js should just have sed and receive functions
*/

const HOME_RED = document.getElementById("iRedHome");
const HOME_GREEN = document.getElementById("iGreenHome");
const HOME_BLUE = document.getElementById("iBlueHome");
const HOME_YELLOW = document.getElementById("iYellowHome");
const START_RED = document.getElementById("iRedStart");
const START_GREEN = document.getElementById("iGreenStart");
const START_BLUE = document.getElementById("iBlueStart");
const START_YELLOW = document.getElementById("iYellowStart");
const START_HOME = document.getElementById("StartHome");
const BTN_THROW = document.getElementById("throw");
const BTN_DONE = document.getElementById("done");
const BTN_RESET = document.getElementById("playagain");
const TXT_VALUE = document.getElementById("value");
const TURNBOX = document.getElementById("turnbox");


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
  "A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7",
  "StartHome", "RedStart", "GreenStart", "BlueStart", "YellowStart",
];
//  Variables
const NUM_OF_DICE = 2;
const DICE_FACES = ["img/woodgrainDot1.png",
  "img/woodgrainDot3.png",
  "img/woodgrainDot4.png",
  "img/woodgrainDot6.png"
];

const PLAYER_RED = 0;
const PLAYER_BLUE = 1;
const PLAYER_GREEN = 2;
const PLAYER_YELLOW = 3;
const NUM_OF_PIECES = 4;
const HOMEPOS = 96;
const GT_UTTT = 0;
const GT_REVERSI = 1;
const GT_PAGADE = 2;
const GAME_TYPE = GT_PAGADE;

const playerInfo = [{
    name: "Red",
    color: "red",
    pieceFile: "img/playingPieceRed.png",
    homeImg: HOME_RED,
    homeFile: "img/RedHome.png",
    locations: [19, 19, 15, 14], //  these will be the indexes in to the board array below of the 4 red pieces
    startImg: START_RED,
    belly: ["B9", "C9", "D9", "E9", "F9", "G9", "H9"] //red belly
  },
  {
    name: "Blue",
    color: "blue",
    pieceFile: "img/playingPieceBlue.png",
    homeImg: HOME_BLUE,
    homeFile: "img/BlueHome.png",
    locations: [67, 67, 62, 63], //  these will be the indexes in to the board array below of the 4 green pieces
    startImg: START_BLUE,
    belly: ["79", "69", "59", "49", "39", "29", "19"] // blue belly
  },
  {
    name: "Green",
    color: "lime",
    pieceFile: "img/playingPieceGreen.png",
    homeImg: HOME_GREEN,
    homeFile: "img/GreenHome.png",
    locations: [43, 43, 39, 38], //  these will be the indexes in to the board array below of the 4 blue pieces
    startImg: START_GREEN,
    belly: ["9B", "9C", "9D", "9E", "9F", "9G", "9H"] // green belly
  },
  {
    name: "Yellow",
    color: "yellow",
    pieceFile: "img/playingPieceYellow.png",
    homeImg: HOME_YELLOW,
    homeFile: "img/YellowHome.png",
    locations: [91, 91, 87, 86], //  these will be the indexes in to the board array of the 4 yellow pieces
    startImg: START_YELLOW,
    belly: ["97", "96", "95", "94", "93", "92", "91"] // yellow belly
  },
];

var diceValue = [1, 3, 4, 6]
var diceRoll = [0, 0];
var turn = 0;
var previousSquare = "";
var moveType = true; //  true to lift peice, false to place piece
var tmpMovePiece = "";
var outputMessage = "";
var displayMessage = false;
var movingPiecePos = -1; //  the index intor the player's location of the peice that is moving
var doublet = false;
var imageLiftedFrom; // this is the image of the place the piece was lifted from
var gameOn = false;
var numOfPlayers = 0;

function determineWhoGoesFirst() {
  //  have each player roll dice and see who starts first
  let largestRoll = -1;
  turn = 0;
  for (let x = 0; x < numOfPlayers; x++) {
    let roll = throwDice();
    if (roll > largestRoll) {
      largestRoll = roll;
      turn = x;
    }
  }

  turn -= 1;
  flipTurnIndicator();
  let message = playerInfo[turn].name + " goes first";
  console.log(message);
  alert(message);
}

function initializeBoard() {
  turn = 0;
  previousSquare = "";
  moveType = true; //  true to lift peice, false to place piece
  tmpMovePiece = "";
  outputMessage = "";
  displayMessage = false;
  movingPiecePos = -1; //  the index intor the player's location of the peice that is moving
  doublet = false;
  playerInfo[PLAYER_RED].locations = [19, 19, 15, 14];
  playerInfo[PLAYER_BLUE].locations = [67, 67, 62, 63];
  playerInfo[PLAYER_GREEN].locations = [43, 43, 39, 38];
  playerInfo[PLAYER_YELLOW].locations = [91, 91, 87, 86];

  for (let p = 0; p < numOfPlayers; p++)
    for (let l = 1; l < NUM_OF_PIECES; l++) {
      let tmpImg = "i" + board[playerInfo[p].locations[l]];
        if (l == 1)
          document.getElementById(tmpImg).src = addNumberToFile(playerInfo[p].pieceFile, 2);
        else
          document.getElementById(tmpImg).src = playerInfo[p].pieceFile;
    }
  } //  end of initialize
  BTN_RESET.addEventListener("click", initializeBoard, false);

  jQuery(document).ready(function($) {
    //  create the event handlers for each box of the game
    for (x = 0; x < board.length; x++) {
      let tmpId = board[x]
      let tempBtn = $("#" + tmpId);
      tempBtn.on("click", function(event) {
        makeMove(tmpId, moveType, true);
        if (displayMessage)
          alert(outputMessage);
        displayMessage = false;
      }); //  end of creating click function
    } //  end of for x
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
    if (turn == (numOfPlayers - 1))
      turn = -1;
    TURNBOX.style.backgroundColor = playerInfo[++turn].color;
  }

  /************************************************
   **         End turn
   ************************************************/
  function endTurn() {
    console.log("End Turn");
    flipTurnIndicator();
    sendEndTurn();
  }
  BTN_DONE.addEventListener("click", endTurn, false);

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
      let spin = Math.floor(Math.random() * DICE_FACES.length);
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
    for (let p = 0; p < numOfPlayers; p++) { //  number of players
      let player = playerInfo[p];
      let startCount = 0;
      let homeCount = 0;
      for (let i = 0; i < NUM_OF_PIECES; i++) {
        if (player.locations[i] == -1)
          startCount++;
        if (player.locations[i] == 100)
          homeCount++
      } //  end for indexes
      if (homeCount > 0) {
        let a = player.homeImg;
        let b = addNumberToFile(player.homeFile, homeCount);;
        a.src = b;
        //player.homeImg.src = addNumberToFile(player.homeFile, homeCount);
      }
      if (homeCount == 4)
        alert(player.name + " WON !!");

      if (startCount > 0)
        player.startImg.src = addNumberToFile(player.pieceFile, startCount);


    } // end for number of players
  } //  end of updateStartHome

  /*******************************************************************************
   **                         Make Move
   *******************************************************************************/
  function makeMove(mmID, mmLift, checkWhoseTurn) {
    //  board pos == 95 is the Start / Home button.  anything greater is Start pieces
    let boardPos = board.indexOf(mmID);
    console.log("square ID/boardPos: " + mmID + "/" + boardPos + ((mmLift == true) ? " - Lifting" : " - Placing"));
    let imgID = "i" + mmID;
    let tmpImage = "";

    if (!gameOn)
      return;

    if (boardPos != HOMEPOS)
      tmpImage = document.getElementById(imgID).src //  get the image on the clicked square
    //  if player is picking up piece....
    if (mmLift) {
      if (boardPos > HOMEPOS)
        movingPiecePos = playerInfo[turn].locations.indexOf(-1);
      else
        movingPiecePos = playerInfo[turn].locations.indexOf(boardPos);

      if (movingPiecePos == -1 && checkWhoseTurn) { //  is it THIS player's turn  ??
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
      imageLiftedFrom = imgID;
      START_HOME.textContent = "Home";
      START_HOME.disabled = false;
      playerInfo[turn].locations[movingPiecePos] = -2; //  the peice is in motion
    } //  of of lifting a piece

    // ***************************************************************************
    //  if player is placing piece on board
    else {
      let p = 0; //  the player currently in that position
      let found = false;

      //  go throught the bellys and see if you are clicking where you shouldn't
      for (let i = 0; i < numOfPlayers; i++) {
        if (i == turn)
          continue;
        if (-1 != playerInfo[i].belly.indexOf(mmID)) {
          document.getElementById(imageLiftedFrom).src = tempSquare;
          alert("You can not place your piece in another player's Belly");
          moveType = true;
          return;
        }
      }
      //  is there a piece the player is moving to ???
      while (p < NUM_OF_PIECES && !found) {
        let pieceIndex = playerInfo[p].locations.indexOf(boardPos);
        if (-1 != pieceIndex)
          found = true;
        else
          p++;
      } //  end while
      if (found) { //  there WAS a piece on the board
        //  i need to check if there are already two peices on that tmpSquare
        if (-1 != tmpImage.indexOf("2.png")) {
          //  put the piece ack where it was
          document.getElementById(imageLiftedFrom).src = tempSquare;
          imageLiftedFrom = "";
          //  alert user
          alert("You can not place a piece on a square occupied by 2 pawns.")
          moveType = true;
          return;

        }
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
        //  did you click on HOME?
        if (boardPos == HOMEPOS)
          boardPos = 100;
        else
          document.getElementById(imgID).src = tempSquare;
      }
      moveType = true;
      playerInfo[turn].locations[movingPiecePos] = boardPos; // place the piece
      movingPiecePos = -1;
      //  if the player is placing a piece, then change whose turn it is
      updateStartHome();
      START_HOME.textContent = "Start";
      START_HOME.disabled = true;
    } //  end of placing a peice
    if (checkWhoseTurn) {
      SendTurn(mmID, mmLift);
    }
  } //  end of Make Move
