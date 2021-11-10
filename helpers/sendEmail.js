const sgMail = require('@sendgrid/mail')
require('dotenv').config()

const { SG_KEY } = process.env

sgMail.setApiKey(SG_KEY)

const sendEmail = async(data) => {
  const email = { ...data, from: 'group4goit@ukr.net' }
  await sgMail.send(email)
}

module.exports = sendEmail
