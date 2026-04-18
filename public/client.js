const socket = io();

let displayLeft = 0;
let displayRight = 0;

function animateScore(id, target) {
  let current = Number(document.getElementById(id).textContent);

  let interval = setInterval(() => {
    if (current === target) return clearInterval(interval);

    current += current < target ? 1 : -1;
    document.getElementById(id).textContent = current;
  }, 20);
}

socket.on("state", (s) => {

  document.getElementById("leftName").textContent = s.left.name;
  document.getElementById("rightName").textContent = s.right.name;

  animateScore("leftScore", s.left.score);
  animateScore("rightScore", s.right.score);

  document.getElementById("round").textContent = s.round;

  document.getElementById("gameText").textContent =
    "Aktuelles Game: " + s.game;

  // TIMER
  let m = Math.floor(s.timer / 60);
  let sec = s.timer % 60;

  document.getElementById("timer").textContent =
    String(m).padStart(2,"0")+":"+String(sec).padStart(2,"0");

  // WINNER
  const w = document.getElementById("winnerBox");

  if (s.winner) {
    w.classList.remove("hidden");
    w.textContent = s.winner.toUpperCase() + " WINS!";
  } else {
    w.classList.add("hidden");
  }
});

// CONTROLS
function score(side) {
  const amount = Number(document.getElementById("scoreAmount").value || 1);
  socket.emit("scoreAdd", { side, amount });
}

function roundChange(d){ socket.emit("roundChange", d); }

function setGame(){
  socket.emit("gameSet", document.getElementById("gameInput").value);
}

function winner(side){
  socket.emit("setWinner", side);
}

function clearWinner(){
  socket.emit("clearWinner");
}

function timerStart(){ socket.emit("timerStart"); }
function timerStop(){ socket.emit("timerStop"); }
function timerReset(){ socket.emit("timerReset"); }
