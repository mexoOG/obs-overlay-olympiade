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
  winPoints: 5, // 🔥 NEU
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
    if (state.winner) return;

    state[side].score += Number(amount);
    if (state[side].score < 0) state[side].score = 0;

    // 🔥 AUTO WIN
    if (state[side].score >= state.winPoints) {
      state.winner = side;
    }

    io.emit("state", state);
  });

  socket.on("setWinPoints", (v) => {
    state.winPoints = Math.max(1, Number(v));
    io.emit("state", state);
  });

  socket.on("roundChange", (d) => {
    state.round += d;
    if (state.round < 1) state.round = 1;
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
    state.left.score = 0;
    state.right.score = 0;
    io.emit("state", state);
  });

  socket.on("update", (data) => {
    state.left = { ...state.left, ...data.left };
    state.right = { ...state.right, ...data.right };
    io.emit("state", state);
  });
});

server.listen(3000);
