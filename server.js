const express = require("express");
const cors = require("cors");
const res = require("express/lib/response");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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

function showDirname(req, res) {
  res.sendFile(__dirname + "/index.html");
}
function showMessages(req, res) {
  res.send(messages);
}
function findText(req, res) {
  const reqText = req.query.text.toLowerCase();
  const textIncl = messages.filter((m) =>
    m.text.toLowerCase().includes(reqText)
  );
  res.send(textIncl);
}
function showLatest(req, res) {
  let latest10 = messages.slice(-10);
  res.send(latest10);
}
function sendMessage(req, res, next) {
  if (!req.body.text || !req.body.from) {
    return res.status(400).send();
  }
  const newMessage = req.body;
  const newID = messages.length;
  newMessage.id = newID;
  newMessage.timeSent = new Date();
  messages.push(newMessage);
  res.send(newMessage);
  return next();
}

function showMessageByID(req, res) {
  const messageId = Number(req.params.id);
  const message = messages.find((m) => m.id === messageId);
  res.send(message);
}
function deleteMessageByID(req, res) {
  const messageId = Number(req.params.id);
  messages = messages.filter((m) => m.id != messageId);
  res.send("Message deleted");
}

app.use(express.json());
app.get("/messages/search", findText);
app.get("/messages/latest", showLatest);
app.get("/messages", showMessages);
app.get("/", showDirname);
app.get("/messages/:id", showMessageByID);
app.post("/messages", sendMessage);
app.delete("/messages/:id", deleteMessageByID);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
