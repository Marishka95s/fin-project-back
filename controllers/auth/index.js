const register = require('./register')
const login = require('./login')
const refreshingToken = require('./refreshToken')
const logout = require('./logout')
const current = require('./current')

module.exports = {
  register,
  login,
  refreshingToken,
  logout,
  current
}
