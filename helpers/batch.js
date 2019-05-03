'use strict'

function batchListAndVariables (emailList, headers) {
  const batch = []
  let batchSectionTo = []
  let batchSectionVars = []

  emailList.forEach((user) => {
    const email = user[0]
    const obj = user.reduce((previous, value, index) => {
      previous[headers[index]] = value
      return previous
    }, {})

    batchSectionTo.push(email)
    const objTo = { }
    objTo[email] = obj
    batchSectionVars.push(objTo)

    if (batchSectionTo.length >= 1000) {
      const b = {
        toArray: [ ...batchSectionTo ],
        recipientVars: [ ...batchSectionVars ]
      }
      batch.push(b)
      batchSectionTo = []
      batchSectionVars = []
    }
  })

  if (batchSectionTo.length) {
    const b = {
      toArray: [ ...batchSectionTo ],
      recipientVars: [ ...batchSectionVars ]
    }
    batch.push(b)
  }

  return batch
}

module.exports = {
  batchListAndVariables
}
