const socket = io();

/* 🔥 SCORE ANIMATION */
function animateScore(id, newValue) {
  const el = document.getElementById(id);
  const old = Number(el.textContent);

  if (old === newValue) return;

  const newEl = document.createElement("div");
  newEl.className = "score";
  newEl.textContent = newValue;

  newEl.style.position = "absolute";
  newEl.style.left = "0";
  newEl.style.right = "0";

  newEl.style.transform = newValue > old
    ? "translateY(100%)"
    : "translateY(-100%)";

  el.parentNode.appendChild(newEl);

  setTimeout(() => {
    newEl.style.transition = "0.3s";
    newEl.style.transform = "translateY(0)";
    el.style.transform = newValue > old
      ? "translateY(-100%)"
      : "translateY(100%)";
  }, 10);

  setTimeout(() => {
    el.textContent = newValue;
    el.style.transform = "translateY(0)";
    newEl.remove();
  }, 300);
}

/* 🎉 REAL CONFETTI */
function startConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let pieces = [];

  for (let i = 0; i < 150; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4,
      speed: Math.random() * 3 + 2,
      color: `hsl(${Math.random()*360},100%,50%)`
    });
  }

  function update() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    pieces.forEach(p => {
      p.y += p.speed;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    requestAnimationFrame(update);
  }

  update();

  setTimeout(() => {
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }, 3000);
}

/* 🔄 STATE */
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

    const name = s.winner === "left"
      ? s.left.name
      : s.right.name;

    w.textContent = name + " WINS!";

    startConfetti(); // 🔥 ANIMATION
  } else {
    w.classList.add("hidden");
  }
});

/* CONTROLS */
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

/* 🔥 TIMER */
function timerStart(){ socket.emit("timerStart"); }
function timerStop(){ socket.emit("timerStop"); }
function timerReset(){ socket.emit("timerReset"); }
