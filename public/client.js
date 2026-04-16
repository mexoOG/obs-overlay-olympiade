const socket = io();

socket.on("state", (s) => {

  // overlay update
  if (document.getElementById("leftScore")) {

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
  }

  // settings sync inputs
  if (document.getElementById("leftName") && document.getElementById("leftName").tagName === "INPUT") {
    document.getElementById("leftName").value = s.left.name;
    document.getElementById("rightName").value = s.right.name;
  }
});

function score(side, delta) {
  socket.emit("score", { side, delta });
}

function round(delta) {
  socket.emit("round", delta);
}

function timerStart() {
  socket.emit("timerStart");
}

function timerStop() {
  socket.emit("timerStop");
}

function timerReset() {
  socket.emit("timerReset");
}