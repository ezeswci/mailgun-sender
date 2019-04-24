'use strict'

const fs = require('fs')
const CsvReadableStream = require('csv-reader')

const inputStream = fs.createReadStream('emails.csv', 'utf8')

function importMails () {
  return new Promise((resolve, reject) => {
    console.log('Start importing emails from csv')
    console.log('===================================')
    const emails = []
    inputStream
      .pipe(CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
      .on('data', (row) => {
        if (row[0].includes('@')) emails.push(row)
        process.stdout.write(`Importing: ${emails.length} emails\r`)
      })
      .on('end', function (res) {
        console.log('===================================')
        console.log('End importing emails from csv')
        resolve(emails)
      })
  })
}

module.exports = {
  importMails
}
