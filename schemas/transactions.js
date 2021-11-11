
const { Schema, model } = require('mongoose')
const Joi = require('joi')

// const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
// { minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }

// const phoneRegex = /^[+]{1}[0-9]{2}[-]{1}[0-9]{3}[-]{1}[0-9]{3}[-]{1}[0-9]{2}[-]{1}[0-9]{2}$/

const transactionSchema = Schema({
  type: {
    type: String,
    required: [true, 'Set type for transaction'],
    enum: ['expense', 'income'],
  },
  category: {
    type: String,
    required: true,
    // если х  ограниченое количество  то зделась  enum
  },
  sum: {
    type: Number,
    required: true,
  },
  comment: {
    type: String
  },
  balance: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  }
},
{ versionKey: false, timestamps: true },)

const joiSchema = Joi.object({
  type: Joi.string().required(),
  category: Joi.string().required(),
  sum: Joi.number().required(),
  comment: Joi.string()
})

const Transaction = model('transaction', transactionSchema)


module.exports = {
  Transaction,
  joiSchema
}
