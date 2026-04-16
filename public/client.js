const socket = io();

// OVERLAY STATE
socket.on("state", (s) => {

  if (document.getElementById("leftScore")) {

    document.getElementById("leftName").textContent = s.left.name;
    document.getElementById("rightName").textContent = s.right.name;

    document.getElementById("leftScore").textContent = s.left.score;
    document.getElementById("rightScore").textContent = s.right.score;

    document.getElementById("round").textContent = s.round;

    // TIMER CENTER FIX
    let m = Math.floor(s.timer / 60);
    let sec = s.timer % 60;

    const timerEl = document.getElementById("timer");
    timerEl.textContent =
      String(m).padStart(2,"0")+":"+String(sec).padStart(2,"0");

    // COLORS FIX (CLEAN WHITE SCORE)
    document.getElementById("leftScore").style.color = "#ffffff";
    document.getElementById("rightScore").style.color = "#ffffff";

    // NAME SIZE
    document.getElementById("leftName").style.fontSize = s.left.nameSize + "px";
    document.getElementById("rightName").style.fontSize = s.right.nameSize + "px";
  }

  // SETTINGS SYNC (optional safe)
  if (document.getElementById("leftName") && document.getElementById("leftName").tagName === "INPUT") {
    document.getElementById("leftName").value = s.left.name;
    document.getElementById("rightName").value = s.right.name;
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

// TIMER
function timerStart(){ socket.emit("timerStart"); }
function timerStop(){ socket.emit("timerStop"); }
function timerReset(){ socket.emit("timerReset"); }
