const socket = io();

socket.on("state", (s) => {

  if (document.getElementById("leftScore")) {

    document.getElementById("leftName").textContent = s.left.name;
    document.getElementById("rightName").textContent = s.right.name;

    document.getElementById("leftScore").textContent = s.left.score;
    document.getElementById("rightScore").textContent = s.right.score;

    document.getElementById("round").textContent = s.round;

    let m = Math.floor(s.timer / 60);
    let sec = s.timer % 60;

    document.getElementById("timer").textContent =
      String(m).padStart(2,"0")+":"+String(sec).padStart(2,"0");

    // FIXED COLORS (NO SETTINGS CONTROL)
    document.getElementById("leftScore").style.color = "orange";
    document.getElementById("rightScore").style.color = "#00aaff";

    // NAME SIZE
    document.getElementById("leftName").style.fontSize = s.left.nameSize + "px";
    document.getElementById("rightName").style.fontSize = s.right.nameSize + "px";
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
