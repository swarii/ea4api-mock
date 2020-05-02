const uuid = require('uuid')

module.exports = {
    mock: function (randomItem) {
        return mock(randomItem)
    }


}

function mock(randomItem) {

    let log = getTemplate()
    log.correlationId = uuid.v4()

    let date = Date.now()
    log.time = date
    log.legs[0].timestamp = date
    log.legs[1].timestamp = date

    log.serviceContexts[0].org = randomItem.org != "" ? randomItem.org : null

    log.serviceContexts[0].app = randomItem.clientapp != "" ? randomItem.clientapp : null

    let api = randomItem.api != "" ? randomItem.api : null
    log.serviceContexts[0].service = api
    log.legs[0].serviceName = api
    log.legs[1].serviceName = api

    log.serviceContexts[0].method = randomItem.method
    log.legs[0].operation = randomItem.method
    log.legs[1].operation = randomItem.method

    log.protocol = 'http'

    if (randomItem.failure) log.status = 'failure'
    else if (randomItem.exception) log.status = 'exception'
    else { // success, responseSLABreach which is a success with duration above threshold (1min)
        log.status = 'success'
        let duration
        if (randomItem.responseTimeSLABreach) duration = Math.round(Math.random() * 10000)
        else duration = Math.round(Math.random() * 499) //total duration is sum of legs (2) duration - we want the the sum to be less than trehshold
        log.duration = duration
        log.serviceContexts[0].duration = duration
        log.legs[0].duration = duration
        log.legs[1].duration = duration
    }

    return log
}

function getTemplate() {
    return {
        type: "transaction",
        time: 1587770929215,
        path: "/api",
        protocol: "http",
        protocolSrc: "8080",
        duration: 7399,
        status: "success",
        serviceContexts: [{
            service: "EMR-System-Patient",
            monitor: true,
            client: "76ab680c-bf98-45a9-9dad-37e892d14eed",
            org: "CareConnex",
            app: "Wearable - Sleep Tracker",
            method: "Upload medical evaluation",
            status: "success",
            duration: 15665
        }],
        customMsgAtts: {},
        correlationId: "84265119000",
        legs: [{
                uri: "/api",
                status: 8481,
                statustext: "OK",
                method: "GET",
                vhost: null,
                wafStatus: 0,
                bytesSent: 1967519,
                bytesReceived: 1998,
                remoteName: "10.134.40.6",
                remoteAddr: "10.134.40.6",
                localAddr: "10.133.49.200",
                remotePort: "43006",
                localPort: "8080",
                sslsubject: null,
                leg: 0,
                timestamp: 1587770929215,
                duration: 117,
                serviceName: "EMR-System-Patient",
                subject: "subject-id-00008291",
                operation: "Upload medical evaluation",
                type: "http",
                finalStatus: "Pass"
            },
            {
                uri: "/api",
                status: 8481,
                statustext: "OK",
                method: "POST",
                vhost: null,
                wafStatus: 0,
                bytesSent: 2104,
                bytesReceived: 1967439,
                remoteName: "Group_2",
                remoteAddr: "10.133.49.200",
                localAddr: "10.133.49.200",
                remotePort: "8280",
                localPort: "49634",
                sslsubject: null,
                leg: 1,
                timestamp: 1587770929215,
                duration: 15664,
                serviceName: "EMR-System-Patient",
                subject: "subject-id-00008291",
                operation: "Upload medical evaluation",
                type: "http",
                finalStatus: null
            }
        ]
    }
}