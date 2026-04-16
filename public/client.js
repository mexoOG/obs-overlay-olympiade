const socket = io();

let pending = null;

// STATE
socket.on("state", (s) => {

  // OVERLAY
  if (document.getElementById("leftScore")) {

    document.getElementById("leftName").textContent = s.left.name;
    document.getElementById("rightName").textContent = s.right.name;

    document.getElementById("leftScore").textContent = s.left.score;
    document.getElementById("rightScore").textContent = s.right.score;

    document.getElementById("round").textContent = s.round;

    // TIMER
    let m = Math.floor(s.timer / 60);
    let sec = s.timer % 60;
    document.getElementById("timer").textContent =
      String(m).padStart(2,"0")+":"+String(sec).padStart(2,"0");

    // COLORS + BORDERS
    document.getElementById("leftBox").style.borderColor = s.left.border;
    document.getElementById("rightBox").style.borderColor = s.right.border;

    document.getElementById("leftScore").style.color = s.left.color;
    document.getElementById("rightScore").style.color = s.right.color;

    // NAME SIZE FIX
    document.getElementById("leftName").style.fontSize = s.left.nameSize + "px";
    document.getElementById("rightName").style.fontSize = s.right.nameSize + "px";
  }

  // SETTINGS SYNC
  if (document.getElementById("leftName") && document.getElementById("leftName").tagName === "INPUT") {
    document.getElementById("leftName").value = s.left.name;
    document.getElementById("rightName").value = s.right.name;
  }
});

// SCORE
function score(side, amount) {
  socket.emit("scoreAdd", { side, amount });
}

// TIMER
function timerStart(){ socket.emit("timerStart"); }
function timerStop(){ socket.emit("timerStop"); }
function timerReset(){ socket.emit("timerReset"); }
