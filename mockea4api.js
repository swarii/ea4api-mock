const cron = require('node-cron')
const fs = require('fs')
const sleep = require('util').promisify(setTimeout)
const PropertiesReader = require('properties-reader')
const transaction = require('./transaction')
const dataset = require('./dataset')
const properties = PropertiesReader(`${__dirname}/app.properties`)

const outputDirectory = properties.get('OutputDirectory')
const mode = properties.get('Mode')
const numberOfTransactions = parseInt(properties.get('NumberOfTransactions'))
const delayBetweenTransactions = (60 / numberOfTransactions) * 1000
const trigger = properties.get('Trigger')

run()

function log(entry) {
    console.log(`${(new Date()).toISOString()}  ${entry}`)
}

async function run() {
    log('Loading dataset')
    await dataset.load(properties.get('Mode'), properties.get('DataSetFile'))

    if (trigger == 'once') {
        log('Running once')
        log(`Generateing ${numberOfTransactions} transactions (${numberOfTransactions/60}/second)`)
        generate()
    } 
    
    else {
        
        if (mode == 'RandomWeight'){
            log('Running once every minute')
            log(`Generating ${numberOfTransactions} transactions (${numberOfTransactions/60}/second)`)
            cron.schedule('* * * * *', () => { // trigger once every minute
            generate()
            })
        }

        else if (mode == 'Fixed'){
            log('Fixed mode not supported yet. Only RandomWeight is supported')
        }       
    }

}

async function generate() {
    

    const fileOutputName = `${outputDirectory}/ea4apijson_${Date.now()}.log`
    
    log(`Writing to ${fileOutputName}`)

    let start, end, mockDuration
    
    for (let i = 0; i < numberOfTransactions; i++) {
        start = Date.now()

        const content = transaction.mock(dataset.getRandomItem())
        fs.appendFileSync(fileOutputName,JSON.stringify(content) + '\r\n')

        end = Date.now()

        mockDuration = end - start

        await sleep(delayBetweenTransactions - mockDuration)
    }

    log(`Done writing to ${fileOutputName}`)

}