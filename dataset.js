const csv2json = require('csvtojson')


let dataWeighted = []


module.exports = {
    load: async function (file) {
        await load(mode, file)
    },
    getRandomItem: function () {
        return getRandomItem()
    }
}

async function load(mode, file) {
    const dataRaw = await csv2json().fromFile(file)
    if (mode == 'randomWeighted')
        randomWeighted()
}

function randomWeighted() {
    for (let i = 0; i < dataRaw.length; i++) {
        let it = dataRaw[i]
        pushWithWeight(cloneAndAssignStatus(it, true, false, false, false), resolveWeight(it.success, 'success'), dataWeighted)
        pushWithWeight(cloneAndAssignStatus(it, true, true, false, false), resolveWeight(it.responseTimeSLABreach, 'responseTimeSLABreach'), dataWeighted)
        pushWithWeight(cloneAndAssignStatus(it, false, false, true, false), resolveWeight(it.failure, 'failure'), dataWeighted)
        pushWithWeight(cloneAndAssignStatus(it, false, false, false, true), resolveWeight(it.exception, 'exception'), dataWeighted)
    }
}

function getRandomItem() {
    let index = Math.ceil(Math.random() * dataWeighted.length)
    let randomItem = dataWeighted[index - 1]
    return (randomItem)
}

function resolveWeight(weight, status) {
    if (status == 'success')
        return weight == '' ? 1 : parseInt(weight)
    else
        return weight == '' ? 0 : parseInt(weight)
}

function pushWithWeight(item, weigth, data) {
    let _weigth = weigth == '' ? 1 : parseInt(weigth)
    for (let i = 0; i < _weigth; i++)
        data.push(item)

}

function cloneAndAssignStatus(item, success, responseTimeSLABreach, failure, exception) {
    const clone = JSON.parse(JSON.stringify(item)) //clone the object so we don't alter the original one
    clone['success'] = success
    clone['responseSLABreach'] = responseTimeSLABreach
    clone['failure'] = failure
    clone['exception'] = exception
    return clone
}