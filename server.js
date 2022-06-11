const express = require("express");
const cors = require("cors");
const res = require("express/lib/response");

const app = express();

app.use(cors());

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
let messages = [welcomeMessage];
app.use(express.json());
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/messages", function (req, res) {
  res.send(messages);
});
app.get("/messages/:id", function (req, res) {
  const messageId = Number(req.params.id);
  const message = messages.find((m) => m.id === messageId);
  res.send(message);
});

app.post("/messages", function (req, res) {
  if (!req.body.text || !req.body.from) {
    return res.status(400).send();
  }
  const newMessage = req.body;
  const newID = messages.length;
  newMessage.id = newID;
  messages.push(newMessage);
  res.send(newMessage);
});
app.delete("/messages/:id", function (req, res) {
  const messageId = Number(req.params.id);
  messages = messages.filter((m) => m.id != messageId);
  res.send("Message deleted");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
