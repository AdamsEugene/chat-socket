let users = [];
let seen = [];
let typing = [];

const addUser = ({ userId, socketId }) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ socketId, userId });
};

const getUsers = ({ userId }) =>
  users.map((user) => user.userId).filter((user) => user !== userId);

const getUserById = ({ socketId }) => {
  users = users.filter((user) => user.socketId !== socketId);
  return users.map((user) => user.userId);
};
const getUser = ({ id }) => users.find((u) => u.userId === id);

const addSeens = ({ id, time }) => {
  !seen.some((s) => s.id === id && s.time === time) && seen.push({ id, time });
  console.log(seen);
};

const removeSeen = (data) => {
  seen = seen.filter(
    (s) => (s.id !== data.idm || s.id !== data.idu) && s.time !== data.time
  );
  return seen;
};

const getSeens = (id) => seen.map((d) => d.time);

const addTyping = (id) => !typing.some((t) => t === id) && typing.push(id);

const getTyping = () => typing;

const removeTyping = (id) => {
  typing = typing.filter((t) => t !== id);
  return typing;
};

module.exports = {
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
};
