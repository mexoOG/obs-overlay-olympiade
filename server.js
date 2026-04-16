const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let state = {
  left: { name: "Kevin", score: 4 },
  right: { name: "Basti", score: 4 },
  round: 1
};

io.on("connection", (socket) => {
  socket.emit("state", state);

  socket.on("update", (newState) => {
    state = { ...state, ...newState };
    io.emit("state", state);
  });

  socket.on("score", ({ side, delta }) => {
    state[side].score += delta;
    io.emit("state", state);
  });

  socket.on("round", (delta) => {
    state.round += delta;
    if (state.round < 1) state.round = 1;
    io.emit("state", state);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Running on " + PORT));
