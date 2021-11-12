const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const { User, RefreshToken } = require('../../schemas')

const { SECRET_KEY } = process.env

const refreshingToken = async (req, res) => {
  const { authorization } = req.headers
  if (!authorization) {
    throw new Unauthorized('Not authorized')
  }
  const [bearer, token] = authorization.split(' ')
  if (bearer !== 'Bearer') {
    throw new Unauthorized('Invalid token')
  }
  const user = await User.findOne({ authorization })
  const userRefreshToken = user.refreshToken

  const refreshToken = await RefreshToken.findOne({ userRefreshToken })
  console.log(refreshToken)

  if (!refreshToken || (Date.now() >= refreshToken.expires) || refreshToken.revoked) {
    res.status(400).json({
      status: 'Bad Request',
      code: 400,
      message: 'Invalid Token'
    })
    return
  }

  const newRefreshToken = `Bearer ${crypto.randomBytes(40).toString('hex')}`

  refreshToken.revoked = Date.now()
  const newRefreshTokenConection = new RefreshToken({
    user: user._id,
    token: newRefreshToken,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  })
  refreshToken.replacedByToken = newRefreshTokenConection.token

  await refreshToken.save()
  await newRefreshTokenConection.save()
  await User.findByIdAndUpdate(user._id, { token, refreshToken: newRefreshToken, refreshTokenConection: newRefreshTokenConection })

  const payload = {
    id: user._id
  }
  const newToken = `Bearer ${jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' })}`

  res.json({
    status: 'New pair of tokens created',
    code: 200,
    token: newToken,
    refreshToken: newRefreshToken,
    user
  })
}

module.exports = refreshingToken
