'use strict'

const jsonfile = require('jsonfile')
const file = 'config/service.json'

const initService = () => {
  return new Promise((resolve, reject) => {
    jsonfile.readFile(file, (err, obj) => {
      if (err) reject(err)
      const { keys, mail } = obj
      const mailgun = require('mailgun-js')(keys)
      resolve({ mailgun, base: mail, keys })
    })
  })
}

module.exports = {
  initService
}
