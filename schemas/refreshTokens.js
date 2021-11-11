const { Schema, model } = require('mongoose')
// const Joi = require('joi')

const refreshTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  token: String,
  expires: Date,
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

refreshTokenSchema.virtual('isActive').get(function () {
  return !this.isExpired && !this.revoked;
});

const RefreshToken = model('refreshToken', refreshTokenSchema)

module.exports = {
  RefreshToken
}
