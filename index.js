'use strict'

const fs = require('fs')

const { importMails } = require('./helpers/readCsv')
const { initService } = require('./helpers/service')
const { sendMails } = require('./helpers/sendMails')
const { write } = require('./helpers/write')

const html = fs.createReadStream('template.html', 'utf8')

const successful = []
const errSend = [];

(async function () {
  const { mailgun, base } = await initService()
  const emailList = await importMails()

  console.log('Start sending emails: ')
  console.log('===================================')
  const amountToSend = emailList.length

  for (const user of emailList) {
    const to = user[0]

    const send = { ...base, to, html }
    try {
      await sendMails(send, mailgun)
      successful.push(to)
    } catch (e) {
      errSend.push([ to, e.message ])
    }
    const totalSend = successful.length + errSend.length
    process.stdout.write(`Send ${totalSend} mails from ${amountToSend}, successful: ${successful.length}, errors: ${errSend.length}\r`)
  }
  const totalSend = successful.length + errSend.length
  console.log(`Send ${totalSend} mails from ${amountToSend}, successful: ${successful.length}, errors: ${errSend.length}\r`)

  console.log('===================================')
  console.log('End sending emails')

  if (errSend.length) {
    const csvErrors = await write(errSend)
    console.log('Errors saved at: ', csvErrors)
  }
  // Guardar en un csv los que tuvieron errores
})()
