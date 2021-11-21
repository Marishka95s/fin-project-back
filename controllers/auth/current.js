const { User } = require('../../schemas')
const { Unauthorized } = require('http-errors')

const current = async(req, res) => {
  const { _id } = req.user
  const user = await User.findById(_id, 'name email balance')
  if (!user) {
    throw new Unauthorized('Not authorized')
  }

  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      user
    }
  })
}

module.exports = current
