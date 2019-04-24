'use strict'

const MailComposer = require('nodemailer/lib/mail-composer')

function sendMails (mailOptions, mailgun) {
  return new Promise((resolve, reject) => {
    const mail = new MailComposer(mailOptions)

    mail.compile().build((err, message) => {
      if (err) return reject(err)

      const dataToSend = {
        to: mailOptions.to,
        message: message.toString('ascii')
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
