
const { Schema, model } = require('mongoose')
const Joi = require('joi')

const categories = ['Основной', 'Дополнительный', 'Еда', 'Авто', 'Развитие', 'Дети', 'Дом', 'Образование', 'Остальные']

const transactionSchema = Schema({
  type: {
    type: String,
    required: [true, 'Установите тип транзакции'],
    enum: ['expense', 'income'],
  },
  category: {
    type: String,
    required: [true, 'Установите категорию транзакции'],
    enum: categories,
  },
  sum: {
    type: Number,
    required: true,
    min: 0
  },
  comment: {
    type: String,
    default: '',
  },
  date: {
    type: String,
    default: (new Date()).toLocaleString('uk-UA', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit'
    })
  },
  month: {
    type: Number,
    default: (new Date()).getMonth() + 1
  },
  year: {
    type: Number,
    default: (new Date()).getFullYear()
  },
  balance: {
    type: Schema.Types.String,
    ref: 'user',
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  }
},
{ versionKey: false, timestamps: true },)

const joiSchema = Joi.object({
  type: Joi.string().valid('expense', 'income').required(),
  category: Joi.string().valid(...categories).required(),
  sum: Joi.number().min(0).required(),
  comment: Joi.string()
})

const Transaction = model('transaction', transactionSchema)

module.exports = {
  Transaction,
  joiSchema,
  categories,
}
