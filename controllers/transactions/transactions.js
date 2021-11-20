const { Transaction } = require('../../schemas')
const { User } = require('../../schemas')

const { categories } = require('../../schemas')

const listTransactions = async (req, res, next) => {
  // const { page = 1, limit = 8 } = req.query
  // const skip = (page - 1) * limit
  const { _id } = req.user
  const transactions = await Transaction.find({ owner: _id }, '_id type category sum comment date month year balance owner createdAt',
  // { skip, limit: +limit }
  ).populate('owner', 'email').sort({ createdAt: -1 })
  res.json({
    status: 'success',
    code: 200,
    data: {
      transactions
    }
  })
}

const add = async (req, res, next) => {
  const { user } = req
  let balance = Number(user.get('balance'))
  if (typeof (req.body.sum) !== 'number') {
    throw new Error('Wrong type of sum')
  }
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
    type: req.body.type,
    category: req.body.category,
    sum: req.body.sum,
    comment: req.body.comment,
    owner: user._id,
    balance
  }
  try {
    const result = await Transaction.create(newTransaction)
    await User.findByIdAndUpdate(user._id, { balance: balance }, { new: true })
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

const getStatistics = async (req, res, next) => {
  let { month = new Date().getMonth() + 1, year = new Date().getFullYear() } = req.query
  month = Number(month)
  year = Number(year)
  if (isNaN(month) || month < 1 || month > 12 || isNaN(year)) {
    throw new Error('Неверно переданны параметры даты.')
  }
  const { _id } = req.user
  const transactions = await Transaction.find({ owner: _id, month, year }, 'type category sum balance')
  if (!transactions) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Ошибка сервера'
    })
    return
  }
  const data = transactions.reduce((result, number) => {
    if (number.type === 'income') { result.income += number.sum }
    if (number.type === 'expense') {
      result.expenseAll += number.sum
      switch (number.category) {
        case 'Основной': result.expenseCategory.Basic += number.sum
          break;
        case 'Еда': result.expenseCategory.Food += number.sum
          break;
        case 'Авто': result.expenseCategory.Auto += number.sum
          break;
        case 'Развитие': result.expenseCategory.Development += number.sum
          break;
        case 'Дети': result.expenseCategory.Children += number.sum
          break;
        case 'Дом': result.expenseCategory.Home += number.sum
          break;
        case 'Образование': result.expenseCategory.Education += number.sum
          break;
        case 'Остальные': result.expenseCategory.Others += number.sum
          break;
        default:
          break
      }
    }
    return result
  }, {
    income: 0,
    expenseAll: 0,
    expenseCategory: {
      Basic: 0,
      Food: 0,
      Auto: 0,
      Development: 0,
      Children: 0,
      Home: 0,
      Education: 0,
      Others: 0,
    }
  })
  res.json(
    {
      status: 'success',
      code: 200,
      data
    })
}

const getCategories = async (req, res) => {
  res.json({
    status: 'success',
    code: 200,
    data: categories
  })
}

module.exports = {
  listTransactions,
  add,
  getCategories,
  getStatistics
}
