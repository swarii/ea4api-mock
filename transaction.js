const uuid = require('uuid')

module.exports = {
    mock: function (randomItem) { return mock(randomItem) }
}

function mock(randomItem) {
    let clone = Object.assign({}, template) //clone the object so we avoid any concurrency issue

    clone.correlationId = uuid.v4()

    let date = Date.now()
    clone.time = date
    clone.legs[0].timestamp = date
    clone.legs[1].timestamp = date

    clone.serviceContexts[0].org = randomItem.org != "" ? randomItem.org : null

    clone.serviceContexts[0].app = randomItem.clientapp != "" ? randomItem.clientapp : null

    let api = randomItem.api != "" ? randomItem.api : null
    clone.serviceContexts[0].service = api
    clone.legs[0].serviceName = api
    clone.legs[1].serviceName = api

    clone.serviceContexts[0].method = randomItem.method
    clone.legs[0].operation = randomItem.method
    clone.legs[1].operation = randomItem.method

    clone.protocol = 'http'

    if (randomItem.failure) clone.status = 'failure'
    else if (randomItem.exception) clone.status = 'exception'
    else { // success or responseSLABreach which is a success with duration above threshold (1min)
        clone.status = 'success'
        let duration
        if (randomItem.responseTimeSLABreach) duration = Math.round(Math.random() * 10000)
        else duration = Math.round(Math.random() * 499) //total duration is sum of the 2 legs durations - 499 * 2 < 1000 we want the the sum to be less than trehshold
        clone.duration = duration
        clone.serviceContexts[0].duration = duration
        clone.legs[0].duration = duration
        clone.legs[1].duration = duration
    }

    return clone
}

const template = {
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