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
    throw new Conflict('Email in use')
  }

  const newUser = new User({ email, name })
  newUser.setPassword(password)

  const result = await newUser.save()

  res.status(201).json({
    status: 'success',
    code: 201,
    message: 'Registred success',
    result
  })
}

module.exports = register
