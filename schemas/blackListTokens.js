const { Schema, model } = require('mongoose')

const blackListSchema = new Schema({
  token: {
    type: String,
    default: null
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
}, { versionKey: false, timestamps: true })
const BlackList = model('blackList', blackListSchema)
module.exports = {
  BlackList,
  blackListSchema
}
