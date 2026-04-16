const socket = io();

socket.on("state",(s)=>{

  // APPLY ONLY TO OBS OVERLAY
  if(document.getElementById("leftName")){
    document.getElementById("leftName").textContent = s.left.name;
    document.getElementById("rightName").textContent = s.right.name;
    document.getElementById("leftScore").textContent = s.left.score;
    document.getElementById("rightScore").textContent = s.right.score;
    document.getElementById("round").textContent = s.round;
    document.getElementById("lastAction").textContent = s.lastAction;
  }

  // SETTINGS INPUT SYNC
  if(document.getElementById("leftName")){
    document.getElementById("leftName").value = s.left.name;
    document.getElementById("rightName").value = s.right.name;
    document.getElementById("color").value = s.color;
  }

  // COLOR ONLY EFFECTS OVERLAY
  document.documentElement.style.setProperty("--main", s.color);
});

function score(side,delta){
  socket.emit("score",{side,delta});
}

function round(d){
  socket.emit("round",d);
}

function reset(){
  socket.emit("reset");
}

setInterval(()=>{
  const l=document.getElementById("leftName");
  const r=document.getElementById("rightName");
  const c=document.getElementById("color");

  if(l && r && c){
    socket.emit("update",{
      left:{name:l.value},
      right:{name:r.value},
      color:c.value
    });
  }
},500);
