const createCsvWriter = require('csv-writer').createArrayCsvWriter
const path = `errors_${new Date()}_.csv`
const csvWriter = createCsvWriter({
  header: ['EMAIL', 'ERROR'],
  path,
  append: true
})

function write (writeData) {
  return new Promise((resolve, reject) => {
    csvWriter.writeRecords(writeData)
      .then(() => {
        resolve(path)
      }).catch((e) => {
        reject(e)
      })
  })
}
module.exports = {
  write
}
