const socket = io();

socket.on("state", (s) => {

  if (document.getElementById("leftScore")) {

    document.getElementById("leftName").textContent = s.left.name;
    document.getElementById("rightName").textContent = s.right.name;

    document.getElementById("leftScore").textContent = s.left.score;
    document.getElementById("rightScore").textContent = s.right.score;

    document.getElementById("round").textContent = s.round;

    // 🔥 GAME TEXT
    document.getElementById("game").textContent =
      "Aktuelles Game: " + (s.game || "-");

    // TIMER
    let m = Math.floor(s.timer / 60);
    let sec = s.timer % 60;

    document.getElementById("timer").textContent =
      String(m).padStart(2,"0")+":"+String(sec).padStart(2,"0");

    // COLORS
    document.getElementById("leftScore").style.color = "#ffffff";
    document.getElementById("rightScore").style.color = "#ffffff";

    // NAME SIZE
    document.getElementById("leftName").style.fontSize = s.left.nameSize + "px";
    document.getElementById("rightName").style.fontSize = s.right.nameSize + "px";
  }
});

// SCORE
function score(side) {
  const amount = Number(document.getElementById("scoreAmount").value || 1);
  socket.emit("scoreAdd", { side, amount });
}

// ROUND
function roundChange(delta) {
  socket.emit("roundChange", delta);
}

function setRound() {
  const val = document.getElementById("roundInput").value;
  socket.emit("roundSet", val);
}

// 🔥 GAME SET
function setGame() {
  const val = document.getElementById("gameInput").value;
  socket.emit("gameSet", val);
}

// TIMER
function timerStart(){ socket.emit("timerStart"); }
function timerStop(){ socket.emit("timerStop"); }
function timerReset(){ socket.emit("timerReset"); }
