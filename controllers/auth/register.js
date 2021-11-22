const { Conflict } = require('http-errors')

const { User } = require('../../schemas')

const register = async (req, res) => {
  if (req.body.email === null || req.body.password === null || req.body.name === null) {
    res.status(400).json({
      status: 'Bad Request',
      code: 400,
      message: 'Ошибка от Joi или другой библиотеки валидации'
    })
    return
  }

  const { email, password, name } = req.body
  const user = await User.findOne({ email })

  if (user) {
    throw new Conflict('Такая почта уже используется')
  }

  const newUser = new User({ email, name, token: null, refreshToken: null, balance: 0, refreshTokenConection: null })
  newUser.setPassword(password)

  const result = await newUser.save()

  res.status(201).json({
    status: 'success',
    code: 201,
    message: 'Регистрация прошла успешно',
    result
  })
}

module.exports = register
