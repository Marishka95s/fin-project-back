const register = require('./register')
const login = require('./login')
const refreshToken = require('./refreshToken')
const logout = require('./logout')
const current = require('./current')
const updateSubscription = require('./updateSubscription')

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  current,
  updateSubscription
}
