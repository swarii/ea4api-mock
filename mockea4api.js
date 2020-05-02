//import Modules
const cron = require('node-cron')
const fs = require('fs')
const sleep = require('util').promisify(setTimeout)
const PropertiesReader = require('properties-reader')
//import js files
const transaction = require('./transaction')
const dataset = require('./dataset')
//load properties
const properties = PropertiesReader(`${__dirname}/app.properties`)
const dataSetFile = properties.get('DataSetFile')
const numberOfTransactions = parseInt(properties.get('NumberOfTransactions'))
const outputDirectory = properties.get('OutputDirectory')
const trigger = properties.get('Trigger')
const mode = properties.get('Mode')
//cron expression to fire once every minute tic
const cronExpression = '* * * * *'
const delayBetweenTransactions = (60 / numberOfTransactions) * 1000

run()

async function run() {
    await dataset.load(mode, dataSetFile)
    if (trigger == 'once') generate()
    else
        cron.schedule(cronExpression, () => {
            generate()
        })
}

async function generate() {
    let fileOutputName = `${outputDirectory}/ea4apijson_${Date.now()}.log`
    console.log(`Task triggered at ${(new Date()).toISOString()}. ${numberOfTransactions} transactions will be written to ${fileOutputName}`)
    for (let i = 0; i < numberOfTransactions; i++) {
        await sleep(delayBetweenTransactions)
        const randomItem = dataset.getRandomItem()
        const content = transaction.mock(randomItem)
        await writeToFile(content, fileOutputName)
    }
}

function writeToFile(content, fileOutputName) {
    return new Promise((resolve, reject) => {
        fs.appendFile(fileOutputName, JSON.stringify(content) + '\r\n', (err) => { // we use stringify because the json log entries are expected on a single line
            if (err) {
                console.warn('can\'t write to file')
                throw err
            }
            resolve()
        })
    })
}