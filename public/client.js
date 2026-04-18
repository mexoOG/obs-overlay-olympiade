const socket = io();

// SCORE ANIMATION
function animateScore(id, newValue) {
  const el = document.getElementById(id);
  const old = Number(el.textContent);

  if (old === newValue) return;

  const newEl = document.createElement("div");
  newEl.className = "score";

  newEl.textContent = newValue;

  if (newValue > old) {
    newEl.style.transform = "translateY(100%)";
  } else {
    newEl.style.transform = "translateY(-100%)";
  }

  el.parentNode.appendChild(newEl);

  setTimeout(() => {
    newEl.style.transform = "translateY(0)";
    el.style.transform = newValue > old ? "translateY(-100%)" : "translateY(100%)";
  }, 10);

  setTimeout(() => {
    el.textContent = newValue;
    el.style.transform = "translateY(0)";
    newEl.remove();
  }, 300);
}

// CONFETTI
function confetti() {
  const canvas = document.getElementById("confetti");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  for (let i = 0; i < 120; i++) {
    ctx.fillStyle = `hsl(${Math.random()*360},100%,50%)`;
    ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height, 6,6);
  }

  setTimeout(() => ctx.clearRect(0,0,canvas.width,canvas.height), 2000);
}

// STATE
socket.on("state", (s) => {

  if (document.getElementById("leftName")) {
    document.getElementById("leftName").textContent = s.left.name;
    document.getElementById("rightName").textContent = s.right.name;
  }

  if (document.getElementById("leftScore")) {
    animateScore("leftScore", s.left.score);
    animateScore("rightScore", s.right.score);
  }

  if (document.getElementById("round")) {
    document.getElementById("round").textContent = s.round;
  }

  if (document.getElementById("gameText")) {
    document.getElementById("gameText").textContent =
      "Aktuelles Game: " + s.game;
  }

  // 🔥 TIMER UPDATE
  if (document.getElementById("timer")) {
    let m = Math.floor(s.timer / 60);
    let sec = s.timer % 60;

    document.getElementById("timer").textContent =
      String(m).padStart(2,"0")+":"+String(sec).padStart(2,"0");
  }

  // WINNER
  const w = document.getElementById("winnerBox");

  if (w) {
    if (s.winner) {
      w.classList.remove("hidden");
      const name = s.winner === "left" ? s.left.name : s.right.name;
      w.textContent = name + " WINS!";
      confetti();
    } else {
      w.classList.add("hidden");
    }
  }
});

// CONTROLS
function score(side) {
  const amount = Number(document.getElementById("scoreAmount").value || 1);
  socket.emit("scoreAdd", { side, amount });
}

function setGame(){
  socket.emit("gameSet", document.getElementById("gameInput").value);
}

function setWin(){
  socket.emit("setWinPoints", document.getElementById("winPoints").value);
}

function clearWinner(){
  socket.emit("clearWinner");
}

function winner(side){
  socket.emit("setWinner", side);
}

function updateNames(){
  socket.emit("update", {
    left: { name: document.getElementById("leftName").value },
    right: { name: document.getElementById("rightName").value }
  });
}

function updateSize(){
  socket.emit("update", {
    left: { nameSize: document.getElementById("leftSize").value },
    right: { nameSize: document.getElementById("rightSize").value }
  });
}

// 🔥 TIMER FUNKTIONEN
function timerStart(){ socket.emit("timerStart"); }
function timerStop(){ socket.emit("timerStop"); }
function timerReset(){ socket.emit("timerReset"); }
