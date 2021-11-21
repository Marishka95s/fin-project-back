const { Unauthorized } = require('http-errors')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const { User, RefreshToken } = require('../../schemas')

const { SECRET_KEY } = process.env
const EXPIRING_TOKEN_TIME = 7 * 24 * 60 * 60 * 1000

const refreshingToken = async (req, res) => {
  const { authorization } = req.headers
  if (!authorization) {
    throw new Unauthorized('Вы неавторезированны!')
  }
  const [bearer] = authorization.split(' ')

  if (bearer !== 'Bearer') {
    throw new Unauthorized('Неправильный токен')
  }

  const userRefreshToken = req.user.refreshToken
  const refreshToken = await RefreshToken.findOne({ userRefreshToken, revoked: null })

  if (!refreshToken || (Date.now() >= refreshToken.expires) || refreshToken.revoked) {
    res.status(400).json({
      status: 'Bad Request',
      code: 400,
      message: 'Неправильный токен'
    })
    return
  }

  const payload = {
    id: req.user._id
  }
  const newToken = `Bearer ${jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' })}`
  const newRefreshToken = `Bearer ${crypto.randomBytes(40).toString('hex')}`

  refreshToken.revoked = Date.now()
  const newRefreshTokenConection = new RefreshToken({
    user: req.user._id,
    token: newRefreshToken,
    expires: new Date(Date.now() + EXPIRING_TOKEN_TIME)
  })

  refreshToken.replacedByToken = newRefreshTokenConection.token
  await refreshToken.save()
  await newRefreshTokenConection.save()
  await User.findByIdAndUpdate(req.user._id, {
    token: newToken,
    refreshToken: newRefreshToken,
    refreshTokenConection: newRefreshTokenConection
  })

  res.json({
    status: 'Новая пара токенов создана',
    code: 200,
    token: newToken,
    refreshToken: newRefreshToken
  })
}

module.exports = refreshingToken
