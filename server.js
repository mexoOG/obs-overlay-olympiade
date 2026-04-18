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
  game: "Game 1",
  winner: null,
  timer: 0,
  timerRunning: false
};

setInterval(() => {
  if (state.timerRunning) {
    state.timer++;
    io.emit("state", state);
  }
}, 1000);

io.on("connection", (socket) => {
  socket.emit("state", state);

  socket.on("scoreAdd", ({ side, amount }) => {
    state[side].score += Number(amount);
    if (state[side].score < 0) state[side].score = 0;
    io.emit("state", state);
  });

  socket.on("roundChange", (d) => {
    state.round += d;
    if (state.round < 1) state.round = 1;
    io.emit("state", state);
  });

  socket.on("roundSet", (v) => {
    state.round = Math.max(1, Number(v));
    io.emit("state", state);
  });

  socket.on("gameSet", (v) => {
    state.game = v;
    io.emit("state", state);
  });

  socket.on("setWinner", (side) => {
    state.winner = side;
    io.emit("state", state);
  });

  socket.on("clearWinner", () => {
    state.winner = null;
    io.emit("state", state);
  });

  socket.on("timerStart", () => state.timerRunning = true);
  socket.on("timerStop", () => state.timerRunning = false);

  socket.on("timerReset", () => {
    state.timer = 0;
    io.emit("state", state);
  });

  socket.on("update", (data) => {
    state.left = { ...state.left, ...data.left };
    state.right = { ...state.right, ...data.right };
    io.emit("state", state);
  });
});

server.listen(3000);
