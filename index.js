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

const { addUser, getUsers, getUserById, getUser } = require("./functions");

io.on("connection", (socket) => {
  console.log("new connection");
  socket.join("default");

  socket.on("addMember", (userId) => {
    addUser({ userId, socketId: socket.id });
    users = getUsers({ userId });
    socket.emit("newMember", users);
    socket.to("default").emit("newMember", [userId]);

    console.log(users);
  });

  socket.on("sendMessage", (data) => {
    const user = getUser({ id: data.receiver });
    if (user) socket.to(user.socketId).emit("newMessage", data);
    console.log(user);
  });

  socket.on("disconnecting", (_reason) => {
    users = getUserById({ socketId: socket.id });
    socket.to("default").emit("someone left", users);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`server is on`));
