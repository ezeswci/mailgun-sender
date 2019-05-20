'use strict'

function sendMails (mailOptions, mailgun) {
  const { to, from, subject, html, headers } = mailOptions
  return new Promise((resolve, reject) => {
    const dataToSend = {
      to,
      from,
      subject,
      html,
      'recipient-variables': headers['X-Mailgun-Recipient-Variables']
    }

    mailgun.messages().send(dataToSend, (sendError, body) => {
      if (sendError) return reject(sendError)
      resolve()
    })
  })
}

module.exports = {
  sendMails
}
