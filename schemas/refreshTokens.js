const { Schema, model } = require('mongoose')
// const Joi = require('joi')

const refreshTokenSchema = new Schema({
  token: {
    type: String,
    default: null
  },
  expires: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  created: {
    type: Date,
    default: Date.now
  },
  revoked: Date,
  replacedByToken: String
});

refreshTokenSchema.virtual('isExpired').get(function () {
  return Date.now() >= this.expires;
});

const RefreshToken = model('refreshToken', refreshTokenSchema)

module.exports = {
  RefreshToken,
  refreshTokenSchema
}
