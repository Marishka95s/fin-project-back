const { User, BlackList } = require('../../schemas')

const logout = async (req, res, next) => {
  const { _id, token } = req.user
  const newBlackList = {
    token: token,
    user: _id,
  }
  try {
    await BlackList.create(newBlackList)
  } catch (error) {
    next(error)
  }
  // пуш токена в блек лист//
  await User.findByIdAndUpdate(_id, { token: null, refreshToken: null })

  res.status(204).json()
}

module.exports = logout
