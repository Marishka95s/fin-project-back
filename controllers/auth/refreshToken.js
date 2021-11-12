const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const { RefreshToken } = require('../../schemas')

const { SECRET_KEY } = process.env

const refreshToken = async (req, res) => {
  const { token } = req.headers
  const refreshToken = await RefreshToken.findOne({ token }).populate('user')
  console.log(refreshToken)
  if (!refreshToken || !refreshToken.isActive) {
    res.status(400).json({
      status: 'Bad Request',
      code: 400,
      message: 'Invalid Token'
    })
    return
  }
  const { user } = refreshToken

  const newRefreshToken = new RefreshToken({
    user: user._id,
    token: crypto.randomBytes(40).toString('hex'),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  })
  refreshToken.revoked = Date.now()
  refreshToken.replacedByToken = newRefreshToken.token
  await refreshToken.save()
  await newRefreshToken.save()

  const newToken = jwt.sign(user, SECRET_KEY, { expiresIn: '15m' })

  res.json({
    status: 'success',
    code: 200,
    token: newToken,
    refreshToken: newRefreshToken.token,
    user
  })
}

module.exports = refreshToken
