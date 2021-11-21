const jwt = require('jsonwebtoken')
const { Unauthorized } = require('http-errors')

const { User, BlackList } = require('../schemas')

const { SECRET_KEY } = process.env

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    throw new Unauthorized('Вы неавторезированны!')
  }

  const [bearer, token] = authorization.split(' ')

  if (bearer !== 'Bearer') {
    throw new Unauthorized('Неправильный токен')
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY)
    const user = await User.findById(id)
    const isTokenInBlackList = await BlackList.findOne({
      token: authorization,
      user: id
    })

    if (!user || !user.token || isTokenInBlackList) {
      throw new Unauthorized('Неправильный токен')
    }

    req.user = user
    next()
  } catch (error) {
    error.status = 401
    error.message = 'Вы неавторезированны!'
    next(error)
  }
}

module.exports = authenticate
