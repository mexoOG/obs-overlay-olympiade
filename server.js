const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

app.get("/", (req,res)=>res.redirect("/settings"));

let state = {
  left: { name: "Player 1", score: 0 },
  right: { name: "Player 2", score: 0 },
  round: 1,
  bestOf: 5,
  color: "#00f5d4",
  lastAction: ""
};

function clampRound() {
  if (state.round < 1) state.round = 1;
}

io.on("connection", (socket) => {
  socket.emit("state", state);

  socket.on("score", ({side, delta}) => {
    state[side].score += delta;
    state.lastAction = `${side} ${delta>0?"+":""}${delta}`;
    io.emit("state", state);
  });

  socket.on("round", (delta) => {
    state.round += delta;
    clampRound();
    io.emit("state", state);
  });

  socket.on("update", (data) => {
    state = { ...state, ...data };
    io.emit("state", state);
  });

  socket.on("reset", () => {
    state.left.score = 0;
    state.right.score = 0;
    state.round = 1;
    state.lastAction = "RESET";
    io.emit("state", state);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>console.log("Running on "+PORT));
