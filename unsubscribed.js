'use strict'

const { initService } = require('./helpers/service')
const { createWriter } = require('./helpers/write')
const path = `csv/unsuscribe_list_${new Date()}_.csv`
const header = [ 'EMAIL', 'CREATED_AT' ]

const writeData = createWriter(path, header)

async function getUnsubscribeEmails (mailgun, url, errs = 0) {
  try {
    const res = await _getUnsubscribeEmails(mailgun, url)
    return res
  } catch (e) {
    if (errs < 5) return setTimeout(() => { getUnsubscribeEmails(mailgun, url, errs++) }, 10000)
    throw ('Mailgun error: ', e)
  }
}

function _getUnsubscribeEmails (mailgun, url) {
  return new Promise((resolve, reject) => {
    mailgun.get(url, (error, body) => {
      if (error) return reject(error)
      const items = (body && body.items) || []
      const nextUrl = items.length && body.paging && body.paging.next
      const next = nextUrl && nextUrl.replace('https://api.eu.mailgun.net/v3', '')
      resolve({ items, next })
    })
  })
};

(async function () {
  const { mailgun, keys } = await initService()
  const { domain } = keys
  const startUrl = `/${domain}/unsubscribes`
  let next = startUrl
  let pageNro = 0
  do {
    const res = await getUnsubscribeEmails(mailgun, next)
    pageNro++
    console.log('Exporting page Nro: ', pageNro)
    next = res && res.next
    const items = res && res.items && res.items.map(i => [i.address, i.created_at])
    await writeData(items)
  } while (next)
  console.log('Finish exporting, csv is ready on file: ', path)
  return ''
})()
