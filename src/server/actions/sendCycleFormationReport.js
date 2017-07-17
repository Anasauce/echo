import fs from 'fs'
import email from 'emailjs'
import tmp from 'tmp'
import config from 'src/config'
import logger from 'src/server/util/logger'
import {writeCSV} from 'src/server/reports/util'

const {reports, smtp} = config

const fromAddress = 'no-reply@learnersguild.org'

const cycleFormationMessage = (filePath, cycleNumber) => {
  return {
    from: `Cycle ${cycleNumber} Formation Report ${fromAddress}`,
    to: reports.projectTeams.email,
    subject: `Analysis Report for cycle ${cycleNumber}`,
    text: `The attached file contains the formation report for cycle ${cycleNumber}.`,
    html: (
      `<p>The attached file contains the formation report for cycle ${cycleNumber}.</p>`
    ),
    attachment: {
      path: filePath,
      name: `Cycle-${cycleNumber}-Formation-Report.csv`
    }
  }
}

const options = {
  user: smtp.user,
  password: smtp.password,
  host: smtp.host,
  port: smtp.port,
  ssl: false
}

export default function sendCycleFormationReport(report, cycleNumber) {
  const tmpFile = tmp.fileSync({
    prefix: `cycle-${cycleNumber}-formation-report-`,
    postfix: '.csv'
  })
  const writeStream = fs.createWriteStream(tmpFile.name)
  writeCSV(report, writeStream)

  if (reports.projectTeams.email === undefined) {
    logger.log(`No report was sent for cycle ${cycleNumber}`)
  }

  const server = email.server.connect(options)

  return server.send(cycleFormationMessage(tmpFile.name, cycleNumber), (err, message) => {
    tmpFile.removeCallback()
    if (err) {
      logger.error(err)
    }
    logger.log(`Cycle Formation Report Emailed to ${message.header.to}`)
  })
}
