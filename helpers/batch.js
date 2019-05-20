'use strict'

function batchListAndVariables (emailList, headers) {
  const allUsers = _createRecipientVars(emailList, headers)

  return _groupIn1k(allUsers)
}

function _createRecipientVars (emailList, headers) {
  const allUsers = { }

  emailList.forEach((user) => {
    const email = user[0]
    const obj = user.reduce((previous, value, index) => {
      if (headers[index]) previous[headers[index]] = value
      return previous
    }, {})

    headers.forEach((header) => {
      if (!obj[header]) obj[header] = ''
    })
    allUsers[email] = obj
  })

  return allUsers
}

function _groupIn1k (allUsers) {
  const emails = Object.keys(allUsers)
  const res = []
  let toArray = [ ]
  let recipientVars = {}

  emails.forEach((email) => {
    toArray.push(email)
    recipientVars[email] = allUsers[email]

    if (toArray.length >= 1000) {
      res.push({
        toArray: [ ...toArray ],
        recipientVars: { ...recipientVars }
      })

      // reset
      toArray = [ ]
      recipientVars = {}
    }
  })

  if (toArray) {
    res.push({
      toArray: [ ...toArray ],
      recipientVars: { ...recipientVars }
    })
  }

  return res
}

module.exports = {
  batchListAndVariables
}
