////  List of socket functions:
//  https://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender
//***************************************************************
//                           Socket stuff
//***************************************************************

const NAME1JOIN = document.querySelector("#p1Name");
const NAME2JOIN = document.querySelector("#p2Name");
const NAME3JOIN = document.querySelector("#p3Name");
const NAME4JOIN = document.querySelector("#p4Name");
const ROOM2 = document.querySelector("#i2room");
const ROOM3 = document.querySelector("#i3room");
const ROOM4 = document.querySelector("#i4room");
const BTN_P2JOIN = document.querySelector("#p2Join");
const BTN_P3JOIN = document.querySelector("#p3Join");
const BTN_P4JOIN = document.querySelector("#p4Join");

const TXT_INPUT = $("#input");
const STATUS = $('#status');
const CONTENT = $('#content');

const NEW = document.querySelector("#new");
const NAMENEW = document.querySelector("#nameNew");
const JOIN = document.querySelector("#join");
const NAMEJOIN = document.querySelector("#nameJoin");
const ROOM = document.querySelector("#room");

const CB_PLAYSOUND = document.querySelector("#playSound");
const MSG_SOUND = new Audio("./sounds/MsgNudge.wav");
const PLAY_SOUND = new Audio("./sounds/Notify.wav");
const BONK_SOUND = new Audio("./sounds/bonk.wav");


var code = -1;
var name = "";
var color = "";

// if user is running mozilla then use it's built-in WebSocket
window.WebSocket = window.WebSocket || window.MozWebSocket;
// if browser doesn't support WebSocket, just show
// some notification and exit
if (!window.WebSocket) {
  CONTENT.html($('<p>', {
    text: 'Sorry, but your browser doesn\'t support WebSocket.'
  }));
  // disable inout and buttons
  disableInput()
}

function disableInput() {
  TXT_INPUT.removeAttr('disabled'); //  enable the message box
  // disable inout and buttons
  NEW.disabled = "disabled";
  BTN_P2JOIN.disabled = true;
  BTN_P3JOIN.disabled = true;
  BTN_P4JOIN.disabled = true;
  NAME1JOIN.disabled = true;
  NAME2JOIN.disabled = true;
  NAME3JOIN.disabled = true;
  NAME4JOIN.disabled = true;
  ROOM2.disabled = true;
  ROOM3.disabled = true;
  ROOM4.disabled = true;
}

jQuery(document).ready(function($) {
  //  handle web page envents
  //Create a new game.
  //  ***************     Create Game     ***************
  $('#new').on('click', function() {
    console.log("New game clicked");
    name = NAME1JOIN.value.escape();
    color = playerInfo[0].color;
    if (!name) {
      const playPromise = BONK_SOUND.play();
      if (playPromise !== null) {
        playPromise.catch(() => {
          BONK_SOUND.play();
        })
      }
      alert('Please enter your name.');
      return;
    }
    if (GAME_TYPE == GT_PAGADE) {
      numOfPlayers = "NaN";
      while (isNaN(numOfPlayers)) {
        numOfPlayers = parseInt(prompt("Enter the  number of players", "4"));
      }
    }
    initializeBoard();
    determineWhoGoesFirst();
    socket.emit('createGame', {
      name: name,
      type: GAME_TYPE,
      start: turn
    });

  }); //  end new game

  //Join an existing game
  //  ***************     Join Game     ***************
  function join(name, room) {
    console.log("Join clicked");

    let roomID = room;
    if (!name || !roomID) {
      const playPromise = BONK_SOUND.play();
      if (playPromise !== null) {
        playPromise.catch(() => {
          BONK_SOUND.play();
        })
      }
      alert('Please enter your name and game code.');
      return;
    }
    socket.emit('joinGame', {
      name: name,
      room: roomID,
      type: GAME_TYPE
    });
  } //  end join

  function join2() {
    console.log("Join 2 clicked");

    name = NAME2JOIN.value.escape();
    color = playerInfo[1].color;
    let roomID = ROOM2.value.escape();
    join(name, roomID);
  }
  BTN_P2JOIN.addEventListener("click", join2, false);

  function join3() {
    console.log("Join 3 clicked");

    name = NAME3JOIN.value.escape();
    color = playerInfo[2].color;
    let roomID = ROOM3.value.escape();
    join(name, roomID);
  }
  BTN_P3JOIN.addEventListener("click", join3, false);

  function join4() {
    console.log("Join 4 clicked");

    name = NAMEJOIN.value.escape();
    color = playerInfo[3].color;
    let roomID = ROOM4.value.escape();
    join(name, roomID);
  }
  BTN_P4JOIN.addEventListener("click", join4, false);

  //Save a game
  //  ***************     Save Game     ***************
  $('#save').on('click', function() {
    console.log("Save clicked");
    alertMsg = "";
    if (code == -1) {
      alertMsg = "Please start a game before attempting to save";
    } else if (0 == boxesTaken) {
      alertMsg = "You cannot save an empty game, please make a move before saving";
    } else {
      alertMsg = "Saving game....Your game will be saved for 30 days\nPlease remember your code:  " + code + "  and your color: " + color;

      socket.emit('save', {
        room: code,
        moves: moves
      });
    }

    const playPromise = BONK_SOUND.play();
    if (playPromise !== null) {
      playPromise.catch(() => {
        BONK_SOUND.play();
      })
    }
    alert(alertMsg);
  }); //  end save

  //Load a game
  //  ***************     Load Game     ***************

  $('#load').on('click', function() {
    console.log("Load clicked");
    let loadCode = $('#loadID').val().escape();
    if ("" == loadCode) {
      const playPromise = BONK_SOUND.play();
      if (playPromise !== null) {
        playPromise.catch(() => {
          BONK_SOUND.play();
        })
      }
      alert("Please enter a code");
      return;
    }
    code = loadCode;
    socket.emit('load', {
      room: loadCode,
      player1: document.getElementById("P1CB").checked,
      type: GAME_TYPE
    });
  }); //  end load

}); //  end document ready function


// handle xss
//  ***************
String.prototype.escape = function() {
  let tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  };
  return this.replace(/[&<>]/g, function(tag) {
    return tagsToReplace[tag] || tag;
  });
};

//  ***************     Send message     ***************
TXT_INPUT.keydown(function(e) {
  if (e.keyCode === 13) {
    console.log("Messsage entered");

    let msg = $(this).val().escape();
    if (!msg) {
      return;
    }
    // send the message as an ordinary text
    socket.emit('message', {
      name: name,
      text: msg,
      color: color,
      room: code
    });
    $(this).val('');
    // disable the TXT_INPUT field to make the user wait until server
    // sends back response
    TXT_INPUT.attr('disabled', 'disabled');
  }
});

//  ***************     Send Turn     ***************
function SendTurn(stID, stMoveType) {
  console.log("Send Turn - id: " + stID + " MoveType: " + stMoveType);

  socket.emit('turn', {
    id: stID,
    moveType: stMoveType,
    room: code
  });
}

//  ************     Send  End Turn     ***************
function sendEndTurn() {
  socket.emit('endTurn', {
    room: code
  });
  yourTurn = false;
}

//  ***************     Send Play Again     ***************
function sendPlayAgain() {
  console.log("Send Play Again");

  socket.emit('playAgain', {
    room: code
  });

  socket.emit('message', {
    name: name,
    text: "has reset the game",
    color: color,
    room: code
  });
} //  end play again

function sendEndTurn() {
  console.log("Sending end turn");
  socket.emit('endTurn', {
    room: code
  });
}

//  ***************
window.onbeforeunload = function() {
  //console.log("in On Before unload");
  socket.emit('close', {
    room: code
  });
  socket.onclose = function() {}; // disable onclose handler first
  socket.close();
};

//***************************************************************
//  responses from server
//***************************************************************
//New Game created. Update UI.
socket.on('newGame', function(data) {
  console.log("On new game - " + data.room);
  let message = 'Ask your friend to enter Game ID: ' + data.room + '. Waiting for player 2...';
  addMessage("SERVER", message, "Black", data.time);
  console.log("System - The count is: " + data.count)
  code = data.room;
  yourTurn = true;
  disableInput();
});

//  ***************     Recieved Join     ***************
socket.on('joined', function(data) {
  console.log("On joined" - " + data.room");
  addMessage("SERVER", data.text, "Black", data.time);
  gameOn = true;
  console.log("\tNumber of players: " + numOfPlayers);
});

//  ***************     Recieved Message     ***************
socket.on('message', function(data) {
  console.log("On message");
  addMessage(data.name, data.text, data.color, data.time);
  TXT_INPUT.removeAttr('disabled'); //  enable the message box
  TXT_INPUT.focus();
});

//  ***************     Recieved Error     ***************
socket.on('err', function(data) {
  console.log("On error");
  addMessage("SERVER", data.text, "black", data.time)
  //CONTENT.prepend(data.message);
});
//Joined the game, so player is player 2
//  ***************     Recieved Player 2     ***************
socket.on('player2', function(data) {
  console.log("On player 2 - " + data.code);
  addMessage(name, " has joined the game.", color, data.time);
  TXT_INPUT.removeAttr('disabled'); //  enable the message box
  STATUS.text('Message: ');
  code = data.code;
  disableInput();
  gameOn = true;
  numOfPlayers = data.nop;
  turn = data.start - 1; //  flip indicator incremeents turn
  flipTurnIndicator();
  let message = playerInfo[turn].name + " goes first";
  console.log(message);
  alert(message);
  console.log("\tNumber of players: " + numOfPlayers);
});

//  ***************     Recieved Turn     ***************
socket.on('turn', function(data) {
  console.log("Server responded from turn - id: " + data.id + " MoveType: " + data.dMoveType);
  makeMove(data.id, data.dMoveType, false);
  if (displayMessage)
    PopUpMessage(outputMessage);
  displayMessage = false;
  if (CB_PLAYSOUND.checked)
    PLAY_SOUND.play();
});

//  *************     Recieved End Turn     *************
socket.on('endTurn', function() {
  flipTurnIndicator();
});


//  ***************     Recieved Play Again     ***************
socket.on('playAgain', function(data) {
  console.log("Onplay again");
  recievedPlayAgain = true;
  onPlayAgain();
});

//  ***************     Recieved Save     ***************
socket.on('saved', function(data) {
  console.log("On save");
  addMessage("SERVER", "The game has been saved", "black", data.time);
});

//  ***************     Recieved Load     ***************
socket.on('load', function(data) {
  console.log("on lLoad");
  checkCurrentGame = false;
  let iLength = data.game.length;
  console.log("Load length: " + iLength);
  for (i = 0; i < iLength; i++) {
    console.log("In load game: " + i);
    let temp = data.game[i].move.toString();
    let p = temp.substring(0, 1);
    let y = temp.substring(1, 2);
    let x = temp.substring(2);
    let id = p + "" + y + "" + x;
    let box = parseInt(y + "" + x);
    gameOn = true;
    makeMove(p - 1, id, box, false)
  } //  end for
  checkCurrentGame = true;
  let whoWentLast = data.game[data.game.length - 1].player;

  //  variable youtTurn is set when create game returns
  // if who went last is 0, and you are player1, it is NOT your turn
  yourTurn = true;
  if (0 == whoWentLast) { //  its player 2's turn
    if (data.player1) //  are you player1?
      yourTurn = false;
  } else if (1 == whoWentLast) { //  it's player1's turn
    if (!data.player1) //  are you NOT player1?
      yourTurn = false;
  }

  let now = new Date().getTime();
  name = data.name;
  if (data.player1) {
    color = PLAYER1_COLOR;
    addMessage("SERVER", name + ": You're the color: " + PLAYER1_COLOR, "black", now);
  } else {
    color = PLAYER2_COLOR;
    addMessage("SERVER", name + ": You're the color: " + PLAYER2_COLOR, "black", now)
  }
  disableInput();
}); //  end load

function addMessage(author, message, color, now) {
  console.log("Add message");
  let dt = new Date(now);
  CONTENT.prepend('<p><span style="color:' + color + '">' +
    author + '</span> @ ' + (dt.getHours() < 10 ? '0' +
      dt.getHours() : dt.getHours()) + ':' +
    (dt.getMinutes() < 10 ?
      '0' + dt.getMinutes() : dt.getMinutes()) +
    ': ' + message + '</p>');
  if (CB_PLAYSOUND.checked) {
    const playPromise = MSG_SOUND.play();
    if (playPromise !== null) {
      playPromise.catch(() => {
        MSG_SOUND.play();
      })
    }
  }

} //  end add message
