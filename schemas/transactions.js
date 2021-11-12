
const { Schema, model } = require('mongoose')
const Joi = require('joi')

const categories = ['Основной', 'Еда', 'Авто', 'Развитие', 'Дети', 'Дом', 'Образование', 'Остальные']

const transactionSchema = Schema({
  type: {
    type: String,
    required: [true, 'Set type for transaction'],
    enum: ['expense', 'income'],
  },
  category: {
    type: String,
    required: true,
    enum: categories,
    // если х  ограниченое количество  то зделась  enum.
  },
  sum: {
    type: Number,
    required: true,
    min: 0
  },
  comment: {
    type: String
  },
  date: {
    type: Number,
  },
  month: {
    type: Number,
  },
  year: {
    type: Number,
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
  category: Joi.string().required(),
  sum: Joi.number().min(0).required(),
  comment: Joi.string()
})

const Transaction = model('transaction', transactionSchema)

module.exports = {
  Transaction,
  joiSchema,
  categories,
}
