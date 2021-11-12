const { User, RefreshToken } = require('../../schemas')

const logout = async (req, res) => {
  // console.log(req.user)
  const user = req.user
  // console.log(user._id)
  await RefreshToken.findOneAndUpdate(user._id, { revoked: Date.now() })
  await User.findByIdAndUpdate(user._id, { token: null, refreshToken: null })
  // console.log(req.user)
  res.status(204).json()
}

module.exports = logout
