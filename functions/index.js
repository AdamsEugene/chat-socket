let users = [];

const addUser = ({ userId, socketId }) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ socketId, userId });
};

const getUsers = ({ userId }) =>
  users.map((user) => user.userId).filter((user) => user !== userId);

const getUserById = ({ socketId }) =>
  users.filter((user) => user.socketId !== socketId).map((user) => user.userId);

const getUser = ({ id }) => users.find((u) => u.userId === id);

module.exports = { addUser, getUsers, getUserById, getUser }; 
