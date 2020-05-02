const csv2json = require('csvtojson')


let dataWeighted = []


module.exports = {
    load: async function (file){
        load(file)
    },
    getRandomItem: function() {
        return getRandomItem()
    }
}

async function load(file) {
    const dataRaw = await csv2json().fromFile(file)
    for (let i = 0; i < dataRaw.length; i++) {
        let it = dataRaw[i]        
        pushWithWeight(changeStatus(it, true, false, false, false), resolveWeight(it.success, 'success'), dataWeighted)
        pushWithWeight(changeStatus(it, true, true, false, false), resolveWeight(it.responseTimeSLABreach, 'responseTimeSLABreach'), dataWeighted)
        pushWithWeight(changeStatus(it, false, false, true, false), resolveWeight(it.failure, 'failure'), dataWeighted)
        pushWithWeight(changeStatus(it, false, false, false, true), resolveWeight(it.exception, 'exception'), dataWeighted)
    }    
}

function getRandomItem() {
    let index = Math.ceil(Math.random() * dataWeighted.length)
    let randomItem = dataWeighted[index - 1]
    return randomItem
}

function resolveWeight(weight,status){
    if(status == 'success') 
        return weight == '' ? 1 : parseInt(weight) 
    else 
        return weight == '' ? 0 : parseInt(weight) 
}

function pushWithWeight(item, weigth, data){
    let _weigth = weigth == '' ? 1 : parseInt(weigth)
    for(let i = 0; i < _weigth; i++)
    { 
        data.push(item)
    }
}

function changeStatus(item, success, responseTimeSLABreach, failure, exception){
    const clone = JSON.parse(JSON.stringify(item)) //used to clone the object because we need to reuse the original one
    clone['success'] = success
    clone['responseSLABreach'] = responseTimeSLABreach
    clone['failure'] = failure
    clone['exception'] = exception
    return clone
}

