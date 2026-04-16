const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let state = {
  left: { name: "Marlov", score: 0, color: "#ff0044" },
  right: { name: "Marlon", score: 0, color: "#00aaff" },
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

  socket.on("score", ({ side, delta }) => {
    state[side].score += delta;
    io.emit("state", state);
  });

  socket.on("round", (delta) => {
    state.round += delta;
    if (state.round < 1) state.round = 1;
    io.emit("state", state);
  });

  socket.on("timerStart", () => (state.timerRunning = true));
  socket.on("timerStop", () => (state.timerRunning = false));

  socket.on("timerReset", () => {
    state.timer = 0;
    io.emit("state", state);
  });

  socket.on("update", (data) => {
    state = { ...state, ...data };
    io.emit("state", state);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Running " + PORT));
