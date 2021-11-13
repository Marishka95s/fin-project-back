const { Transaction } = require('../../schemas')
const { User } = require('../../schemas')

const { categories } = require('../../schemas')

const listTransactions = async (req, res, next) => {
  const { page = 1, limit = 8 } = req.query
  const skip = (page - 1) * limit
  const { _id } = req.user
  const transactions = await Transaction.find({ owner: _id }, '_id type category sum comment date month year balance owner ', { skip, limit: +limit }).populate('owner', 'email')
  res.json({
    status: 'success',
    code: 200,
    data: {
      transactions
    }
  })
}

const getById = async (req, res, next) => {
  const { transactionId } = req.params
  const transaction = await Transaction.findById(transactionId)
  if (!transaction) {
    res.status(404).json({
      status: 'error',
      code: 404,
      message: `Contact with id ${transactionId} not found`
    })
    return
  }
  res.json(
    {
      status: 'success',
      code: 200,
      transaction
    })
}

const add = async (req, res, next) => {
  const { user } = req
  let balance = Number(user.get('balance'))
  req.body.type === 'income' ? balance += req.body.sum : balance -= req.body.sum
  if (balance < 0) {
    res.status(400).json({
      status: 'Bad Request',
      code: 400,
      message: 'Ошибка недостаточно средств на счету'
    })
    return
  }
  const newTransaction = {
    ...req.body,
    owner: user._id,
    balance
  }
  try {
    await User.findByIdAndUpdate(user._id, { balance: balance }, { new: true })
    const result = await Transaction.create(newTransaction)
    res.status(201).json({
      status: 'successfully created',
      code: 201,
      data: {
        result
      }
    })
  } catch (error) {
    next(error)
  }
}

const updateById = async (req, res, next) => {
  const { transactionId } = req.params
  const result = await Transaction.findByIdAndUpdate(transactionId, req.body)
  if (!result) {
    res.status(404).json({
      status: 'error',
      code: 404,
      message: `Contact with id ${transactionId} not found`
    })
    return
  }
  res.json({
    status: 'successfuly updated',
    code: 202,
    result
  })
}

const removeById = async (req, res, next) => {
  const { transactionId } = req.params
  const transaction = await Transaction.findByIdAndRemove(transactionId)
  if (!transaction) {
    res.status(404).json({
      status: 'error',
      code: 404,
      message: `Contact with id ${transactionId} not found`
    })
    return
  }
  res.json(
    {
      status: 'successfully deleted',
      code: 204
    })
}

const updateTransactionStatusById = async (req, res) => {
  if (req.body.favorite === undefined) {
    res.status(400).json({
      status: 'error',
      code: 404,
      message: 'missing field favorite'
    })
    return
  }
  const { transactionId } = req.params
  const result = await Transaction.findByIdAndUpdate(transactionId, req.body)
  if (!result) {
    res.status(404).json({
      status: 'error',
      code: 404,
      message: `Contact with id ${transactionId} not found`
    })
    return
  }
  res.json({
    status: 'successfuly updated',
    code: 202
  })
}
const getCategories = async (req, res) => {
  res.json({ data: categories })
}

module.exports = {
  listTransactions,
  getById,
  add,
  updateById,
  removeById,
  updateTransactionStatusById,
  getCategories
}
