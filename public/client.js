const socket = io();

socket.on("state", (s) => {

  // OVERLAY
  if (document.getElementById("leftScore")) {

    document.getElementById("leftName").textContent = s.left.name;
    document.getElementById("rightName").textContent = s.right.name;

    document.getElementById("leftScore").textContent = s.left.score;
    document.getElementById("rightScore").textContent = s.right.score;

    document.getElementById("round").textContent = s.round;

    // APPLY COLORS
    document.getElementById("leftBox").style.borderColor = s.left.border;
    document.getElementById("leftScore").style.color = s.left.color;

    document.getElementById("rightBox").style.borderColor = s.right.border;
    document.getElementById("rightScore").style.color = s.right.color;

    // NAME SIZE
    document.getElementById("leftName").style.fontSize = s.left.nameSize + "px";
    document.getElementById("rightName").style.fontSize = s.right.nameSize + "px";
  }

  // SETTINGS INPUT SYNC
  if (document.getElementById("leftName") && document.getElementById("leftName").tagName === "INPUT") {
    document.getElementById("leftName").value = s.left.name;
    document.getElementById("rightName").value = s.right.name;
  }
});

/* SCORE ADD */
function add(side, amount) {
  socket.emit("scoreAdd", { side, amount });
}

/* SCORE REMOVE */
function remove(side, amount) {
  socket.emit("scoreAdd", { side, amount: -amount });
}

/* TIMER */
function timerStart(){ socket.emit("timerStart"); }
function timerStop(){ socket.emit("timerStop"); }
function timerReset(){ socket.emit("timerReset"); }

/* UPDATE SETTINGS LIVE */
setInterval(() => {

  const data = {
    left: {
      name: document.getElementById("leftName")?.value,
      color: document.getElementById("leftColor")?.value,
      border: document.getElementById("leftBorder")?.value,
      nameSize: parseInt(document.getElementById("leftSize")?.value || 32)
    },
    right: {
      name: document.getElementById("rightName")?.value,
      color: document.getElementById("rightColor")?.value,
      border: document.getElementById("rightBorder")?.value,
      nameSize: parseInt(document.getElementById("rightSize")?.value || 32)
    }
  };

  socket.emit("update", data);

}, 300);
