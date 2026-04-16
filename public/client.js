const socket = io();

socket.on("state", (state) => {
  document.getElementById("leftName").textContent = state.left.name;
  document.getElementById("rightName").textContent = state.right.name;

  document.getElementById("leftScore").textContent = state.left.score;
  document.getElementById("rightScore").textContent = state.right.score;

  document.getElementById("round").textContent = state.round;

  if (document.getElementById("leftNameInput")) {
    document.getElementById("leftNameInput").value = state.left.name;
    document.getElementById("rightNameInput").value = state.right.name;
  }
});

function score(side, delta) {
  socket.emit("score", { side, delta });
}

function round(delta) {
  socket.emit("round", delta);
}

function updateNames() {
  socket.emit("update", {
    left: { name: document.getElementById("leftNameInput").value },
    right: { name: document.getElementById("rightNameInput").value }
  });
}
