let users = [];
let seen = [];

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

const addSeens = ({ id, time }) =>{
  !seen.some((s) => s.id === id && s.time === time) && seen.push({ id, time });
  console.log(seen)
}
const getSeens = (id) => seen.map((d) => d.time);

module.exports = {
  addUser,
  getUsers,
  getUserById,
  getUser,
  addSeens,
  getSeens,
};
