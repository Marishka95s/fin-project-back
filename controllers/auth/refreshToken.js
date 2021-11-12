const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const { User, RefreshToken } = require('../../schemas')

const { SECRET_KEY } = process.env

const refreshingToken = async (req, res) => {
  const user = req.user
  console.log(req.user)
  // const user = await User.findOne({ authorization })
  const userRefreshToken = user.refreshToken
  console.log(userRefreshToken)

  const refreshTokenFromDB = await RefreshToken.findOne({ userRefreshToken })
  console.log(refreshTokenFromDB.token)
  console.log(refreshTokenFromDB)
  if (!refreshTokenFromDB) {
    res.status(400).json({
      status: 'Bad Request',
      code: 400,
      message: 'User not found'
    })
    return
  }
  if (userRefreshToken.refreshToken === refreshTokenFromDB.refreshToken) {
    res.status(400).json({
      status: 'Bad Request',
      code: 400,
      message: 'That token has already been changed'
    })
    return
  }

  if ((Date.now() >= refreshTokenFromDB.expires) || refreshTokenFromDB.revoked) {
    res.status(400).json({
      status: 'Bad Request',
      code: 400,
      message: 'Invalid Token'
    })
    return
  }

  const payload = {
    id: user._id
  }
  const newToken = `Bearer ${jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' })}`
  const newRefreshToken = `Bearer ${crypto.randomBytes(40).toString('hex')}`

  await RefreshToken.findOneAndUpdate({ user, revoked: null }, { revoked: Date.now(), replacedByToken: newRefreshToken })

  const newRefreshTokenConection = new RefreshToken({
    user: user._id,
    token: newToken,
    refreshToken: newRefreshToken,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  })

  // await refreshTokenFromDB.save()
  // await RefreshToken.findOneAndUpdate(user._id, { revoked: Date.now() })
  await newRefreshTokenConection.save()
  await User.findByIdAndUpdate(user._id, { token: newToken, refreshToken: newRefreshToken, refreshTokenConection: newRefreshTokenConection })

  res.json({
    status: 'New pair of tokens created',
    code: 200,
    token: newToken,
    refreshToken: newRefreshToken,
    user
  })
}

module.exports = refreshingToken
