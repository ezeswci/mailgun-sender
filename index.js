'use strict'

const fs = require('fs')

const { importMails } = require('./helpers/readCsv')
const { initService } = require('./helpers/service')
const { sendMails } = require('./helpers/sendMails')
const { write } = require('./helpers/write')
const { batchListAndVariables } = require('./helpers/batch')

const readHtml = () => {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile('template.html', 'utf8', (err, html) => {
        if (err) return reject(err)
        resolve(html)
      })
    } catch (e) {
      reject(e)
    }
  })
}

const successful = []
const errSend = [];

(async function () {
  const { mailgun, base } = await initService()
  const { emailList, headers } = await importMails()
  const html = await readHtml()
  const createBatchList = batchListAndVariables(emailList, headers)

  console.log('Start sending emails: ')
  console.log('===================================')
  const amountToSend = createBatchList.length

  for (const batch of createBatchList) {
    const { toArray, recipientVars } = batch
    const headers = {
      'X-Mailgun-Recipient-Variables': JSON.stringify(recipientVars)
    }
    const to = toArray

    const send = { ...base, to, headers, html }
    try {
      await sendMails(send, mailgun)
      successful.push(batch)
    } catch (e) {
      errSend.push([ JSON.stringify(toArray), e.message ])
    }
    const totalSend = successful.length + errSend.length
    process.stdout.write(`Send ${totalSend} batches from ${amountToSend}, successful: ${successful.length}, errors: ${errSend.length}\r`)
  }
  const totalSend = successful.length + errSend.length
  console.log(`Send ${totalSend} batches from ${amountToSend}, successful: ${successful.length}, errors: ${errSend.length}\r`)

  console.log('===================================')
  console.log('End sending emails')

  if (errSend.length) {
    const csvErrors = await write(errSend)
    console.log('Errors saved at: ', csvErrors)
  }
})()
