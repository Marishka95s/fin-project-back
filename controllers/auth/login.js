const { Unauthorized } = require('http-errors')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const { User, RefreshToken } = require('../../schemas')

const { SECRET_KEY } = process.env
const EXPIRING_TOKEN_TIME = 7 * 24 * 60 * 60 * 1000

const login = async (req, res) => {
  const { email, password } = req.body
  if (email === null || password === null) {
    res.status(400).json({
      status: 'Bad Request',
      code: 400,
      message: 'Ошибка от Joi или другой библиотеки валидации'
    })
    return
  }

  const user = await User.findOne({ email })
  if (!user || !user.comparePassword(password)) {
    throw new Unauthorized('Email or password is wrong')
  }

  const payload = {
    id: user._id
  }

  const token = `Bearer ${jwt.sign(payload, SECRET_KEY, { expiresIn: '120m' })}`
  const refreshToken = `Bearer ${crypto.randomBytes(40).toString('hex')}`
  const refreshTokenConection = new RefreshToken({
    user: user._id,
    token: refreshToken,
    expires: new Date(Date.now() + EXPIRING_TOKEN_TIME)
  })

  await refreshTokenConection.save()
  await User.findByIdAndUpdate(user._id, { token, refreshToken, refreshTokenConection })
  const updatedUser = await User.findOne({ email })

  res.json({
    status: 'success',
    code: 200,
    token,
    refreshToken,
    user: updatedUser
  })
}

module.exports = login
