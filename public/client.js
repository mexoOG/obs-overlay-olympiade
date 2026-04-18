const socket = io();

// SCORE ANIMATION
function animateScore(id, newValue) {
  const el = document.getElementById(id);

  const old = Number(el.textContent);

  if (old === newValue) return;

  const newEl = document.createElement("div");
  newEl.className = "score anim";

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
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  for (let i = 0; i < 100; i++) {
    ctx.fillStyle = `hsl(${Math.random()*360},100%,50%)`;
    ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height, 5,5);
  }

  setTimeout(() => ctx.clearRect(0,0,canvas.width,canvas.height), 2000);
}

socket.on("state", (s) => {

  document.getElementById("leftName").textContent = s.left.name;
  document.getElementById("rightName").textContent = s.right.name;

  animateScore("leftScore", s.left.score);
  animateScore("rightScore", s.right.score);

  document.getElementById("round").textContent = s.round;
  document.getElementById("gameText").textContent = "Aktuelles Game: " + s.game;

  const w = document.getElementById("winnerBox");

  if (s.winner) {
    w.classList.remove("hidden");

    const name = s.winner === "left" ? s.left.name : s.right.name;

    w.textContent = name + " WINS!";
    confetti();
  } else {
    w.classList.add("hidden");
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

function updateNames(){
  socket.emit("update", {
    left: { name: document.getElementById("leftName").value },
    right: { name: document.getElementById("rightName").value }
  });
}
