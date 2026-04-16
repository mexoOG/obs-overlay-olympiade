const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let state = {
  left: { name: "Marlov", score: 0, nameSize: 32 },
  right: { name: "Marlon", score: 0, nameSize: 32 },
  round: 1,
  timer: 0,
  timerRunning: false
};

// TIMER
setInterval(() => {
  if (state.timerRunning) {
    state.timer++;
    io.emit("state", state);
  }
}, 1000);

io.on("connection", (socket) => {
  socket.emit("state", state);

  // SCORE (+ / - FLEX)
  socket.on("scoreAdd", ({ side, amount }) => {
    state[side].score += Number(amount);
    if (state[side].score < 0) state[side].score = 0;
    io.emit("state", state);
  });

  // ROUND + / -
  socket.on("roundChange", (delta) => {
    state.round += Number(delta);
    if (state.round < 1) state.round = 1;
    io.emit("state", state);
  });

  // ROUND SET DIRECT
  socket.on("roundSet", (value) => {
    state.round = Math.max(1, Number(value));
    io.emit("state", state);
  });

  // TIMER
  socket.on("timerStart", () => (state.timerRunning = true));
  socket.on("timerStop", () => (state.timerRunning = false));

  socket.on("timerReset", () => {
    state.timer = 0;
    io.emit("state", state);
  });

  // SETTINGS UPDATE
  socket.on("update", (data) => {
    state.left = { ...state.left, ...data.left };
    state.right = { ...state.right, ...data.right };
    io.emit("state", state);
  });
});

server.listen(3000, () => console.log("RUNNING"));
