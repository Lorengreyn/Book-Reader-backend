const { User } = require('../models/user');

const updateToken = async (id, token) => {
  try {
    return await User.updateOne({ _id: id }, { token });
  } catch (error) {
    throw new Error(error.message);
  }
};

const userService = { updateToken };

module.exports = userService;
