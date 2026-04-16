const socket = io();

socket.on("state", (s) => {

  // TEXT
  document.getElementById("leftName").textContent = s.left.name;
  document.getElementById("rightName").textContent = s.right.name;

  document.getElementById("leftScore").textContent = s.left.score;
  document.getElementById("rightScore").textContent = s.right.score;

  document.getElementById("round").textContent = s.round;

  // TIMER
  let m = Math.floor(s.timer / 60);
  let sec = s.timer % 60;

  document.getElementById("timer").textContent =
    String(m).padStart(2, "0") + ":" + String(sec).padStart(2, "0");

  // 🎨 TEAM COLORS (IMPORTANT FIX)
  document.getElementById("leftBox").style.borderColor = s.left.color;
  document.getElementById("leftBox").style.boxShadow = `0 0 20px ${s.left.color}`;
  document.getElementById("leftScore").style.color = s.left.color;

  document.getElementById("rightBox").style.borderColor = s.right.color;
  document.getElementById("rightBox").style.boxShadow = `0 0 20px ${s.right.color}`;
  document.getElementById("rightScore").style.color = s.right.color;
});

// SCORE
function score(side, delta) {
  socket.emit("score", { side, delta });
}

// ROUND
function round(delta) {
  socket.emit("round", delta);
}

// TIMER
function timerStart() {
  socket.emit("timerStart");
}

function timerStop() {
  socket.emit("timerStop");
}

function timerReset() {
  socket.emit("timerReset");
}
