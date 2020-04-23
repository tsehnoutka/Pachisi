// TODO:


//  Variables
const PLAYER1 = 0;
const PLAYER2 = 1;
const PLAYER1_COLOR = "black";
const PLAYER2_COLOR = "white";
const PLAYER1_FILE = "img/pieceDark.png";
const PLAYER2_FILE = "img/pieceLight.png";

const NUM_OF_SHELLS = 6;
const SHELL_UP_FILE = "img/Shell_Up.png";
const SHELL_DOWN_FILE = "img/Shell_Down.png";
const BTN_THROW = document.getElementById("throw");
const TXT_VALUE = document.getElementById("value");
const START_RED = document.getElementById("Red");
const START_BLUE = document.getElementById("Blue");
const START_GREEN = document.getElementById("Green");
const START_YELLOW = document.getElementById("Yellow");


function RedStartClicked() {
  console.log("Red Start clicked")
}
START_RED.addEventListener("click", RedStartClicked, false);



var aValue = [25, 10, 2, 3, 4, 5, 6]
var value = -1;
var rollAgain = false;

function throwShells() {
  console.log("throwing shells")
  rollAgain = false;
  let num_up = 0;
  for (x = 0; x < NUM_OF_SHELLS; x++) {
    let id = "s" + (x + 1);
    console.log("ID: " + id);
    let spin = Math.round(Math.random());
    if (spin == 0) {
      document.getElementById(id).src = SHELL_DOWN_FILE;
    } else {
      document.getElementById(id).src = SHELL_UP_FILE;
      num_up++;
    }
    value = aValue[num_up];
    TXT_VALUE.value = value;
  }
  if (num_up<2 ||  num_up==6)
    rollAgain = false;
  console.log("Number Up: " + num_up + "  Value: " + value);

}
BTN_THROW.addEventListener("click", throwShells, false);
