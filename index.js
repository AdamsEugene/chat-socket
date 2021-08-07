const app = require("express")();
const server = require("http").createServer(app);
// server-side
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

const {
  addUser,
  getUsers,
  getUserById,
  getUser,
  addSeens,
  getSeens,
  addTyping,
  getTyping,
  removeTyping,
  removeSeen,
} = require("./functions");

io.on("connection", (socket) => {
  console.log("new connection");
  socket.join("default");

  socket.on("addMember", (userId) => {
    addUser({ userId, socketId: socket.id });
    users = getUsers({ userId });
    socket.emit("newMember", users);
    socket.to("default").emit("newMember", [userId]);
    console.log(socket.rooms);
  });

  socket.on("sendMessage", (data) => {
    const user = getUser({ id: data.receiver });
    if (user) socket.to(user.socketId).emit("newMessage", data);
  });

  socket.on("seen message", (data) => {
    addSeens({ id: data.id, time: data.time });
    const user = getUser({ id: data.id });
    user && socket.to(user.socketId).emit("set seen", getSeens(data.id));
  });

  socket.on("i have seen", (data) => removeSeen(data));

  socket.on("is typing", (id) => {
    addTyping(id);
    socket.to("default").emit("some one typing", getTyping());
  });

  socket.on("not typing", (id) => {
    const ids = removeTyping(id);
    socket.to("default").emit("some one typing", ids);
  });

  // GORUPS

  socket.on("join group", (name) => socket.join(name));

  socket.on("is typing group", ({ groupName, userName }) => {
    socket
      .to(groupName)
      .emit("group member is typing", { groupName, userName });
    // Send to rome; user is typing
  });

  socket.on("not typing group", (groupName) =>
    socket.to(groupName).emit("group member is typing", null)
  );

  socket.on("send GroupM essage", (data) => {
    const { receiver, ...others } = data;
    const message = { groupName: data.receiver, ...others, seen: true };
    // Send message to room
    socket.to(message.groupName).emit("group message incomming", message);
  });

  socket.on("disconnecting", (_reason) => {
    users = getUserById({ socketId: socket.id });
    socket.to("default").emit("someone left", users);
    console.log(users);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`server is on`));
