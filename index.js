const express = require("express");
const queryString = require("query-string");
const url = require("url");

const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
app.set("view engine", "ejs");
let name, group;
let rooms = [];
app.get("/", (req, res) => {
  res.render("index");
  // res.render("llm");
});

app.get("/send", (req, res) => {
  const parsed = url.parse(req.url, true).query;
  name = parsed.name;
  group = parsed.group;

  res.render("inbox", { name, group });
});
app.get("/exitroom", (req, res) => {
  res.redirect("/");
});
io.on("connection", (socket) => {
  io.to(group).emit("welcome", "You are in room no. " + group);

  socket.on("userMessage", (data) => {
    console.log(data);

    let room = data.room;
    socket.join(room);
    io.sockets.to(room).emit("userMessage", data);
    socket.on("exit", (data) => {
      socket.leave(data);
    });
  });
});
http.listen(8080, () => {
  console.log("server is running on port " + 8080);
});
