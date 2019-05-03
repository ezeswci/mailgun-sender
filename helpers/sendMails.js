'use strict'

const MailComposer = require('nodemailer/lib/mail-composer')

/*
const toArray = ['recipient+test1@gmail.com', 'recipient+test2@gmail.com']

const recipientVars = {
  'recipient+test1@gmail.com': {
    first: 'Recv1',
    id: 1
  },
  'recipient+test2@gmail.com': {
    first: 'Recv2',
    id: 2
  }
}

const mailOptions = {
  from: 'test+sender@gmail.com',
  to: toArray,
  subject: 'Hey, %recipient.first%',
  text: 'Hello %recipient.id%',
  html: 'Hello <b>%recipient.id%</b>',
  headers: {
    'X-Mailgun-Recipient-Variables': JSON.stringify(recipientVars)
  }
}

const mail = new MailComposer(mailOptions)
mail.compile().build(function (err, message) {
  const data = {
    to: toArray,
    message: message.toString('ascii'),
    'recipient-variables': recipientVars
  }

  mailgun.messages().sendMime(data, function (err, body) {
    console.log(body)
  })
})
*/
function sendMails (mailOptions, mailgun) {
  return new Promise((resolve, reject) => {
    const mail = new MailComposer(mailOptions)

    mail.compile().build((err, message) => {
      if (err) return reject(err)

      const dataToSend = {
        to: mailOptions.to,
        message: message.toString('ascii'),
        'recipient-variables': mailOptions.headers['X-Mailgun-Recipient-Variables']
      }

      mailgun.messages().sendMime(dataToSend, (sendError, body) => {
        if (sendError) return reject(sendError)
        resolve()
      })
    })
  })
}

module.exports = {
  sendMails
}
