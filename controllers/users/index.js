const register = require("./signup");
const login = require("./login");
const logout = require("./logout");
const current = require("./current");
const verifyEmail = require("./verifyEmail");
const resendVerifyEmail = require("./resendVerifyEmail");

module.exports = {
    register,
    login,
    logout,
    current,
    verifyEmail,
    resendVerifyEmail,
}