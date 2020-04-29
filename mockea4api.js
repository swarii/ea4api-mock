const cron = require('node-cron')
const fs = require('fs')
const uuid = require('uuid')
const csv2json = require('csvtojson')
const sleep = require('util').promisify(setTimeout)
const PropertiesReader = require('properties-reader')
const properties = PropertiesReader(`${__dirname}/app.properties`)

const dataSetFile = properties.get('DataSetFile')
const numberOfTransactions = parseInt(properties.get('NumberOfTransactions'))
const outputDirectory = properties.get('OutputDirectory')
const mode = properties.get('Mode')

const cronExpression = '* * * * *'
const delayBetweenTransactions = (60 / numberOfTransactions) * 1000

let fileOutputName
let log = loadTransactionTemplate()

if ( mode == 'continuous')   runContinous()
if ( mode == 'now')   runNow()

//End

async function runContinous() {
    let dataSet = await loadDataSet(dataSetFile)
    cron.schedule(cronExpression, () => {
        fileOutputName = `${outputDirectory}/ea4apijson_${Date.now()}.log`
        console.log(`Task triggered at ${(new Date()).toISOString()}. ${numberOfTransactions} transactions will be written to ${fileOutputName}`)
        mock(numberOfTransactions, dataSet)
    })
}

async function runNow() {
    let dataSet = await loadDataSet(dataSetFile)
    fileOutputName = `${outputDirectory}/ea4apijson_${Date.now()}.log`
    console.log(`Task triggered at ${(new Date()).toISOString()}. ${numberOfTransactions} transactions will be written to ${fileOutputName}`)
    mock(numberOfTransactions, dataSet)
}

async function loadDataSet(file) {
    const dataRaw = await csv2json().fromFile(file)
    let dataWeighted = []
    for (let i = 0; i < dataRaw.length; i++) {
        let it = dataRaw[i]
        if (it.weigth != "") {
            weigth = parseInt(it.weigth, 10)
            for (let j = 0; j < weigth; j++) {
                dataWeighted.push(it)
            }
        } else dataWeighted.push(it)
    }
    return dataWeighted
}

async function mock(_numberOfTransactions, data) {
    for (let i = 0; i < _numberOfTransactions; i++) {
        await sleep(delayBetweenTransactions)
        await writeToFile(await mockTransaction(data))
    }
}



function writeToFile(content) {
    return new Promise((resolve, reject) => {
        fs.appendFile(fileOutputName, JSON.stringify(content) + '\r\n', (err) => {
            if (err) {
                console.warn('can\'t write to file')
                throw err
            }
            resolve()
        })
    })
}

function getRandomItem(data) {
    return new Promise((resolve, reject) => {
        let index = Math.ceil(Math.random() * data.length)
        let randomItem = data[index - 1]
        if (randomItem == null)
            reject(new Error(`empty randomItem. dataset lenght ${data.length} random index ${index}`))
        resolve(randomItem)
    })
}

async function mockTransaction(data) {
    let randomItem = await getRandomItem(data)

    if (randomItem == null) {
        console.log("received empty randomItem")
        return
    }

    log.correlationId = uuid.v4()

    let date = Date.now()
    log.time = date
    log.legs[0].timestamp = date
    log.legs[1].timestamp = date

    log.serviceContexts[0].org = randomItem.org != null ? randomItem.org : null  
    log.serviceContexts[0].app = randomItem.clientapp != null ? randomItem.clientapp : null 

    log.serviceContexts[0].service = randomItem.api
    log.legs[0].serviceName = randomItem.api
    log.legs[1].serviceName = randomItem.api

    log.serviceContexts[0].method = randomItem.method
    log.legs[0].operation = randomItem.method
    log.legs[1].operation = randomItem.method

    log.protocol = 'http'


    if (randomItem.failure) log.status = 'failure'
    else if (randomItem.exception) log.status = 'exception'
    else {
        log.status = 'success'
        let duration =  Math.round(Math.random() * 499)
        if (randomItem.responseTimeSLABreach) duration += Math.round(Math.random() * 10000)
        log.duration = duration
        log.serviceContexts[0].duration = duration
        log.legs[0].duration = duration
        log.legs[1].duration = duration
    }

    return log
}

function loadTransactionTemplate() {
    return {
        "type": "transaction",
        "time": 1587770929215,
        "path": "/api",
        "protocol": "http",
        "protocolSrc": "8080",
        "duration": 7399,
        "status": "success",
        "serviceContexts": [{
            "service": "EMR-System-Patient",
            "monitor": true,
            "client": "76ab680c-bf98-45a9-9dad-37e892d14eed",
            "org": "CareConnex",
            "app": "Wearable - Sleep Tracker",
            "method": "Upload medical evaluation",
            "status": "success",
            "duration": 15665
        }],
        "customMsgAtts": {},
        "correlationId": "84265119000",
        "legs": [{
                "uri": "/api",
                "status": 8481,
                "statustext": "OK",
                "method": "GET",
                "vhost": null,
                "wafStatus": 0,
                "bytesSent": 1967519,
                "bytesReceived": 1998,
                "remoteName": "10.134.40.6",
                "remoteAddr": "10.134.40.6",
                "localAddr": "10.133.49.200",
                "remotePort": "43006",
                "localPort": "8080",
                "sslsubject": null,
                "leg": 0,
                "timestamp": 1587770929215,
                "duration": 117,
                "serviceName": "EMR-System-Patient",
                "subject": "subject-id-00008291",
                "operation": "Upload medical evaluation",
                "type": "http",
                "finalStatus": "Pass"
            },
            {
                "uri": "/api",
                "status": 8481,
                "statustext": "OK",
                "method": "POST",
                "vhost": null,
                "wafStatus": 0,
                "bytesSent": 2104,
                "bytesReceived": 1967439,
                "remoteName": "Group_2",
                "remoteAddr": "10.133.49.200",
                "localAddr": "10.133.49.200",
                "remotePort": "8280",
                "localPort": "49634",
                "sslsubject": null,
                "leg": 1,
                "timestamp": 1587770929215,
                "duration": 15664,
                "serviceName": "EMR-System-Patient",
                "subject": "subject-id-00008291",
                "operation": "Upload medical evaluation",
                "type": "http",
                "finalStatus": null
            }
        ]
    }
}